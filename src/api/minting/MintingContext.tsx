import { createContext, useEffect, useState, useContext } from "react";
import { ProjectBaseInformation } from "../project-base-information/ProjectBaseInformation";
import { ProjectBaseInformationContext } from "../project-base-information/ProjectBaseInformationContext";
import { MINTED_COUNT_CHANGED_EVENT, MintingContractWrapper, MintState, MINT_STATE_CHANGED_EVENT, WHITELIST_COUNT_CHANGED_EVENT } from "./MintingContractWrapper";
import { resolveNetwork } from "../network/resolveNetwork";
import { abi } from "../../views/Minting/abi";
import { abi as erc20NftMintingAbi } from './abis/erc20MintNftMintAbi';
import { abi as erc20Abi } from '../stores/abi';
import { BigNumber, ethers } from "ethers";
import useUser from "../account/useUser";
import { ERC20TokenWrapper } from "../stores/ERC20TokenWrapper";

export type InitMinting = {
    contractAddress: string;
    liveMintingCount?: boolean;
    liveMintingState?: boolean;
}

export type MintingContextType = {
    balance: BigNumber;
    allowance: BigNumber;
    isInitialized: boolean;
    isApproving: boolean;
    contractAddress: string;
    isMintInProgress: boolean;
    isRequiringApproval: boolean;
    mintCount: number;
    mintState: MintState;
    whitelistCount: number;
    priceSymbol: string;
    init: (opts: InitMinting) => Promise<void>;
    approve: (amount: number) => Promise<void>;
    mint: (amount: number) => Promise<{ succeed: boolean, tokenIds?: number[] }>;
    fetchImageUrls: (tokenIds: number[]) => Promise<string[]>;
    countTotalPrice: (amount: number) => BigNumber;
}

export const MintingContext = createContext<MintingContextType>(null as any);

export const MintingProvider: React.FC = ({ children }) => {
    const baseInformationContext = useContext(ProjectBaseInformationContext);
    const user = useUser();
    const [isRequiringApproval, setIsRequiringApproval] = useState(false);
    const [priceSymbol, setPriceSymbol] = useState<string>('');
    const [isInitialized, setIsInitialized] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const [allowance, setAllowance] = useState<BigNumber>(BigNumber.from(0));
    const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));
    const [contractAddress, setContractAddress] = useState<string>('');
    const [isMinting, setIsMinting] = useState(false);
    const [mintCount, setMintCount] = useState(0);
    const [whitelistCount, setWhitelistCount] = useState(0);
    const [mintState, setMintState] = useState<MintState>('NotStarted');
    const [mintingWrapper, setMintingWrapper] = useState<MintingContractWrapper>();
    const [erc20Wrapper, setErc20Wrapper] = useState<ERC20TokenWrapper | null>(null);

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

    const countTotalPrice = (amount: number): BigNumber => {
        const baseInfo = baseInformationContext.getConfig(contractAddress);
        return BigNumber.from(baseInfo.mint?.weiCost || 0).mul(amount);
    }

    const init = async (opts: InitMinting) => {
        const baseInformation = baseInformationContext.getConfig(opts.contractAddress) as ProjectBaseInformation;

        if (!baseInformation.mint) {
            return;
        }

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

        const network = resolveNetwork(baseInformation.network);
        const signerOrProvider = user.getSignerOrProvider(network.networkId);
        if (baseInformation.mint.priceErc20Token) {
            const erc20Contract = new ethers.Contract(
                baseInformation.mint.priceErc20Token,
                erc20Abi,
                signerOrProvider
            );

            const erc20Wrapper = new ERC20TokenWrapper(erc20Contract);
            const symbol = await erc20Wrapper.getSymbol();

            setPriceSymbol(symbol);
            setIsRequiringApproval(true);
            setErc20Wrapper(erc20Wrapper);
            if (user.account) {
                const [allowance, balance] = await Promise.all([
                    erc20Wrapper.getAllowance(user.account.walletAddress, baseInformation.contractAddress),
                    erc20Wrapper.getBalance(user.account.walletAddress)
                ]);

                setAllowance(allowance);
                setBalance(balance);
            }

            mintingAbi = erc20NftMintingAbi;
        } else {
            setPriceSymbol(network.symbol);
        }

        const contract = new ethers.Contract(
            opts.contractAddress,
            mintingAbi,
            signerOrProvider
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

    const approve = async (amount: number): Promise<void> => {
        if (!isRequiringApproval || !erc20Wrapper) {
            return;
        }

        setIsApproving(true);
        try {
            const totalPrice = countTotalPrice(amount);
            await erc20Wrapper.approve(totalPrice, contractAddress);
            setAllowance(totalPrice);
        } finally {
            setIsApproving(false);
        }
    }

    const mint = async (amount: number): Promise<{ succeed: boolean, tokenIds?: number[] }> => {
        checkInitialized();

        setIsMinting(true);
        try {

            let afterSuccessfulMintCallback: (() => void) | null = null;
            if (isRequiringApproval) {
                const totalPrice = countTotalPrice(amount);
                if (totalPrice.gt(allowance)) {
                    console.log('Mint failed: No enought allowance')
                    return { succeed: false }
                }

                afterSuccessfulMintCallback = () => {
                    setAllowance(allowance.sub(totalPrice));
                }
            }

            // To be sure
            if (!mintingWrapper) {
                console.warn('Minting contract or minting opts is undefined');
                return { succeed: false };
            }

            const mintOpts = mintState === 'WhitelistOpen' ? { whitelistMint: true } : {};
            const res = await mintingWrapper.mint(amount, walletAddress, mintOpts);

            if (res.succeed && typeof afterSuccessfulMintCallback === 'function') {
                afterSuccessfulMintCallback();
            }

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
        approve,
        fetchImageUrls,
        countTotalPrice,
        balance,
        allowance,
        priceSymbol,
        isRequiringApproval,
        isInitialized,
        contractAddress,
        mintCount,
        mintState,
        whitelistCount,
        isApproving,
        isMintInProgress: isMinting
    }

    return (
        <MintingContext.Provider value={contextValue}>
            {children}
        </MintingContext.Provider>
    );
}