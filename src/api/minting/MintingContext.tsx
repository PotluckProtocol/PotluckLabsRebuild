import { createContext, useEffect, useState, useContext } from "react";
import { ProjectBaseInformation } from "../project-base-information/ProjectBaseInformation";
import { ProjectBaseInformationContext } from "../project-base-information/ProjectBaseInformationContext";
import { MINTED_COUNT_CHANGED_EVENT, MintingContractWrapper, MintState, MINT_STATE_CHANGED_EVENT, WHITELIST_COUNT_CHANGED_EVENT } from "./MintingContractWrapper";
import { resolveNetwork } from "../network/resolveNetwork";
import { abi } from "../../views/Minting/abi";
import { ethers } from "ethers";
import useUser from "../account/useUser";

export type InitMinting = {
    contractAddress: string;
    liveMintingCount?: boolean;
    liveMintingState?: boolean;
}

export type MintingContextType = {
    isInitialized: boolean;
    contractAddress: string;
    isMintInProgress: boolean;
    mintCount: number;
    mintState: MintState;
    whitelistCount: number;
    init: (opts: InitMinting) => Promise<void>;
    mint: (amount: number) => Promise<{ succeed: boolean, tokenIds?: number[] }>;
    fetchImageUrls: (tokenIds: number[]) => Promise<string[]>;
}

export const MintingContext = createContext<MintingContextType>(null as any);

export const MintingProvider: React.FC = ({ children }) => {
    const baseInformationContext = useContext(ProjectBaseInformationContext);
    const user = useUser();
    const [isInitialized, setIsInitialized] = useState(false);
    const [contractAddress, setContractAddress] = useState<string>('');
    const [isMinting, setIsMinting] = useState(false);
    const [mintCount, setMintCount] = useState(0);
    const [whitelistCount, setWhitelistCount] = useState(0);
    const [mintState, setMintState] = useState<MintState>('NotStarted');
    const [mintingWrapper, setMintingWrapper] = useState<MintingContractWrapper>();

    const walletAddress = user.account?.walletAddress || '';

    useEffect(() => {
        if (mintingWrapper) {
            mintingWrapper.on(
                MINTED_COUNT_CHANGED_EVENT,
                (mintedCount: number) => setMintCount(mintedCount)
            );

            mintingWrapper.on(
                MINT_STATE_CHANGED_EVENT,
                (mintState: MintState) => setMintState(mintState)
            );

            mintingWrapper.on(
                WHITELIST_COUNT_CHANGED_EVENT,
                (wlCount: number) => setWhitelistCount(wlCount)
            )

            // Get mint count immediately
            mintingWrapper.getMintState();
            mintingWrapper.getMintedCount();
            if (walletAddress) {
                mintingWrapper.getWhitelistCount(walletAddress);
            }
        }

        return () => {
            if (mintingWrapper) {
                mintingWrapper.clearListeners();
            }
        }
    }, [mintingWrapper, walletAddress, setMintCount, setMintState, setWhitelistCount])

    const checkInitialized = () => {
        if (!isInitialized) {
            throw new Error('Contract not initialized');
        }
    }

    const init = async (opts: InitMinting) => {
        const baseInformation = baseInformationContext.getConfig(opts.contractAddress) as ProjectBaseInformation;

        let mintingAbi = abi;

        /**
         * @info
         * Ugly hack for enabling SuperSerum mint on AVAX.
         * This contract has mint method without amount.
         * Replaces the mint method inputs from original abi
         * with the one without arguments.
         * @todo remove me after AVAX SuperSerum is sold out.
         */
        if (opts.contractAddress === '0x246CBfEfd5B70D74335F0aD25E660Ba1e2259858') {
            // For satisfying type checker
            if (Array.isArray(mintingAbi)) {
                mintingAbi = [...mintingAbi];

                const index = mintingAbi.findIndex(item => item.type === 'function' && item.name === 'mint');
                if (index > -1) {
                    mintingAbi[index] = {
                        ...mintingAbi[index],
                        inputs: []
                    }
                }
            }
        }

        const contract = new ethers.Contract(
            opts.contractAddress,
            mintingAbi,
            user.getSignerOrProvider(resolveNetwork(baseInformation.network).networkId)
        );

        console.log('Init Minting:', opts.contractAddress);

        const hasWhitelist = baseInformation.mint && !baseInformation.mint.noWhitelist;

        const mintingWrapper = new MintingContractWrapper(contract, baseInformation, {
            liveMintingCount: opts.liveMintingCount,
            liveMintStateRefresh: opts.liveMintingState,
            hasWhitelist
        });

        setContractAddress(opts.contractAddress);
        setMintingWrapper(mintingWrapper);
        setIsInitialized(true);
    }

    const mint = async (amount: number): Promise<{ succeed: boolean, tokenIds?: number[] }> => {
        checkInitialized();

        setIsMinting(true);

        try {
            // To be sure
            if (!mintingWrapper) {
                console.warn('Minting contract or minting opts is undefined');
                return { succeed: false };
            }

            const res = await mintingWrapper.mint(amount, walletAddress);
            return res;
        } finally {
            setIsMinting(false);
        }
    }

    const fetchImageUrls = async (tokenIds: number[]): Promise<string[]> => {
        checkInitialized();
        if (mintingWrapper) {
            return mintingWrapper.getImageUrls(tokenIds);
        } else {
            return [];
        }
    }

    const contextValue: MintingContextType = {
        init,
        mint,
        fetchImageUrls,
        isInitialized,
        contractAddress,
        mintCount,
        mintState,
        whitelistCount,
        isMintInProgress: isMinting
    }

    return (
        <MintingContext.Provider value={contextValue}>
            {children}
        </MintingContext.Provider>
    );
}