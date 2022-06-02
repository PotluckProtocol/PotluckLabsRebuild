import { BigNumber, BigNumberish, Contract, ethers } from "ethers";
import { createContext, useState } from "react";
import useUser from "../account/useUser";
import { resolveNetwork } from "../network/resolveNetwork";
import { abi } from "./abi";
import { getTraversingFees } from "./lz-endpoint/getTraversingFees";
import { Chain, Traversing } from "./Traversing";
import { getTraversingChainInfo, TRAVERSING_CHAIN_MAP } from "./TraversingChainMap";

export type InitTraversing = {
    traversing: Traversing;
}

export type TraversingContextType = {
    isInitialized: boolean;
    currentlyTraversingTokens: { tokenId: number, targetNetworkId: number }[];
    walletTokens: LoadedToken[];
    walletBalances: BalanceMap;
    init: (opts: InitTraversing) => Promise<void>;
    traverseChains: (tokenId: number, targetNetworkId: number) => Promise<boolean>;
}

export const TraversingContext = createContext<TraversingContextType>(null as any);

type ContractMap = {
    [networkId: number]: Contract;
}

type BalanceMap = {
    [networkId: number]: number;
}

type LoadedToken = { tokenId: number, currentNetworkId: number };

export const TraversingProvider: React.FC = ({ children }) => {

    const user = useUser();
    const [currentlyTraversingTokens, setCurrentlyTraversingTokens] = useState<TraversingContextType['currentlyTraversingTokens']>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [contractMap, setContractMap] = useState<ContractMap>({});
    const [balanceMap, setBalanceMap] = useState<BalanceMap>({});
    const [loadedTokens, setLoadedTokens] = useState<LoadedToken[]>([]);

    const loadTokenIds = async (contract: Contract, walletAddress: string, networkId: number): Promise<{ balance: number, tokenIds: number[] }> => {
        const balance = Number(await contract.balanceOf(walletAddress));

        const tokenIds: number[] = [];
        for (let index = 0; index < balance; index++) {
            const res = Number(await contract.tokenOfOwnerByIndex(walletAddress, index));
            tokenIds.push(res);
        }

        return {
            balance,
            tokenIds
        }
    }

    const init = async (opts: InitTraversing) => {
        setIsInitialized(false);

        if (!user.account) {
            return;
        }

        const { walletAddress } = user.account;

        const contractMap: ContractMap = {};
        const balanceMap: BalanceMap = {};
        const loadedTokens: LoadedToken[] = [];

        const initChain = async (chain: Chain) => {
            const networkId = chain.network.networkId;
            const signerOrProvider = user.getSignerOrProvider(networkId);
            const contract = new ethers.Contract(chain.contractAddress, abi, signerOrProvider);
            contractMap[networkId] = contract;

            const { balance, tokenIds } = await loadTokenIds(contract, walletAddress, networkId);

            loadedTokens.push(
                ...tokenIds.map(id => ({
                    tokenId: id,
                    currentNetworkId: networkId
                }))
            );

            balanceMap[networkId] = balance;
        }

        const initChainPromises = opts.traversing.chains.map(initChain);

        await Promise.all(initChainPromises);

        setLoadedTokens(loadedTokens.sort((i1, i2) => i1.tokenId - i2.tokenId));
        setBalanceMap(balanceMap);
        setContractMap(contractMap);
        setIsInitialized(true);
    }

    const traverseChains = async (tokenId: number, targetNetworkId: number): Promise<boolean> => {

        if (!!currentlyTraversingTokens.find(item => item.tokenId === tokenId)) {
            console.log(`Traversing: Token ${tokenId} already traversing.`);
            return false;
        }

        const { traverseChainId: targetNetworkTraverseChainId } = getTraversingChainInfo(targetNetworkId) || {}
        if (!targetNetworkTraverseChainId) {
            console.log(`Traversing: Could not retrieve traverse chain id for network ${targetNetworkId}.`);
            return false;
        }

        const tokenCurrentNetworkId = loadedTokens.find(item => item.tokenId === tokenId)?.currentNetworkId;
        if (!tokenCurrentNetworkId) {
            console.log(`Traversing: Could not find current network for token ${tokenId}.`);
            return false;
        }

        if (user.account?.network.networkId !== tokenCurrentNetworkId) {
            console.log('Traversing: User network is not matching with traversing tokenId network');
            return false;
        }

        const currentNetworkContract = contractMap[tokenCurrentNetworkId];
        if (!currentNetworkContract) {
            console.log(`Traversing: Could not find NFT contract for network ${tokenCurrentNetworkId}`);
            return false;
        }

        const { endpoint: currentNetworkTraversingEndpoint } = getTraversingChainInfo(tokenCurrentNetworkId) || {}
        if (!currentNetworkTraversingEndpoint) {
            console.log(`Traversing: Could not find traversing endpoint for network ${tokenCurrentNetworkId}`);
            return false;
        }

        setCurrentlyTraversingTokens([...currentlyTraversingTokens, { tokenId, targetNetworkId }]);
        try {
            const traversingFeees = await getTraversingFees({
                currentTokenContractAddress: currentNetworkContract.address,
                endpointContractAddress: currentNetworkTraversingEndpoint,
                signerOrProvider: user.getSignerOrProvider(tokenCurrentNetworkId),
                targetTraversingChainId: targetNetworkTraverseChainId,
                tokenId
            });

            try {
                const tx = await currentNetworkContract.traverseChains(targetNetworkTraverseChainId, tokenId, { value: traversingFeees });
                await tx.wait();

                const tokens = [...loadedTokens];
                const traversedIndex = tokens.findIndex(item => item.tokenId === tokenId);
                if (traversedIndex > -1) {
                    tokens[traversedIndex].currentNetworkId = targetNetworkId;
                    setLoadedTokens(tokens);
                }

                return true;
            } catch (e) {
                console.log('Traversing: Traversing call failed', e);
                return false;
            }
        } finally {
            setCurrentlyTraversingTokens(currentlyTraversingTokens.filter(item => item.tokenId !== tokenId));
        }
    }

    const contextValue: TraversingContextType = {
        isInitialized,
        currentlyTraversingTokens,
        walletBalances: balanceMap,
        walletTokens: loadedTokens,
        init,
        traverseChains
    }

    return (
        <TraversingContext.Provider value={contextValue}>
            {children}
        </TraversingContext.Provider>
    );
}