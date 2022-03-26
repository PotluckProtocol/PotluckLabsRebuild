import { createContext, useEffect, useState, useContext } from "react";
import { Account } from "../account/Account";
import useAccount from "../account/useAccount";
import { AbiItems, Contract } from '../../types/Contracts';
import { ProjectBaseInformation } from "../project-base-information/ProjectBaseInformation";
import { ProjectBaseInformationContext } from "../project-base-information/ProjectBaseInformationContext";
import { MINTED_COUNT_CHANGED_EVENT, MintingContractWrapper, MintState, MINT_STATE_CHANGED_EVENT, WHITELIST_COUNT_CHANGED_EVENT } from "./MintingContractWrapper";

export type InitMinting = {
    contractAddress: string;
    weiCost: number;
    gasLimit: number;
    abi: AbiItems;
    liveMintingCount?: boolean;
}

export type MintingContextType = {
    isInitialized: boolean;
    contractAddress: string;
    isMinting: boolean;
    mintCount: number;
    mintState: MintState;
    whitelistCount: number;
    init: (opts: InitMinting) => Promise<void>;
    mint: (amount: number) => Promise<boolean>;
}

export const MintingContext = createContext<MintingContextType>(null as any);

export const MintingProvider: React.FC = ({ children }) => {
    const baseInformationContext = useContext(ProjectBaseInformationContext);
    const account = useAccount();
    const [isInitialized, setIsInitialized] = useState(false);
    const [contractAddress, setContractAddress] = useState<string>('');
    const [isMinting, setIsMinting] = useState(false);
    const [mintCount, setMintCount] = useState(0);
    const [whitelistCount, setWhitelistCount] = useState(0);
    const [mintState, setMintState] = useState<MintState>('NotStarted');
    const [mintingWrapper, setMintingWrapper] = useState<MintingContractWrapper>();

    const walletAddress = account?.walletAddress || '';

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
        const web3 = account?.web3Instance;
        if (!web3) {
            return;
        }
        const contract = new web3.eth.Contract(
            opts.abi,
            opts.contractAddress
        );

        const baseInformation = baseInformationContext.getConfig(opts.contractAddress) as ProjectBaseInformation;

        console.log('Init Minting:', opts.contractAddress);

        setContractAddress(opts.contractAddress);
        setIsInitialized(true);

        const hasWhitelist = baseInformation.mint && !baseInformation.mint.noWhitelist;

        const mintingWrapper = new MintingContractWrapper(contract, baseInformation, {
            liveMintingCount: opts.liveMintingCount,
            hasWhitelist
        });

        // async background
        mintingWrapper.getMintState();

        setMintingWrapper(mintingWrapper);
    }

    const mint = async (amount: number): Promise<boolean> => {
        checkInitialized();

        setIsMinting(true);

        try {
            // To be sure
            if (!mintingWrapper) {
                console.warn('Minting contract or minting opts is undefined');
                return false;
            }

            return mintingWrapper.mint(amount, walletAddress);
        } finally {
            setIsMinting(false);
        }
    }

    const contextValue: MintingContextType = {
        init,
        mint,

        isInitialized,
        contractAddress,
        mintCount,
        mintState,
        whitelistCount,
        isMinting
    }

    return (
        <MintingContext.Provider value={contextValue}>
            {children}
        </MintingContext.Provider>
    );
}