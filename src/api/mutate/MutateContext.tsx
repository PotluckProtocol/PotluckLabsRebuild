import { createContext, useState, useContext } from "react";
import useAccount from "../account/useAccount";
import { ProjectBaseInformationContext } from "../project-base-information/ProjectBaseInformationContext";
import { MutateContractWrapper } from "./MutateContractWrapper";
import { Web3Context } from "../web3/Web3Context";
import { resolveNetwork } from "../network/resolveNetwork";
import { serumAbi } from "./abis/serum";
import { targetAbi } from "./abis/target";

export type InitMutate = {
    serumContractAddress: string;
}

export type MutateContextType = {
    init: (opts: InitMutate) => Promise<void>;
    approveAll: () => Promise<boolean>;
    isApproved: () => Promise<boolean>;
    mutate: (serumTokenId: number) => Promise<{ succeed: boolean, imageUrl?: string }>;

    isApproving: boolean;
    isMutating: boolean;
    isInitialized: boolean;

    serumIds: number[];
}

export const MutateContext = createContext<MutateContextType>(null as any);

export const MutateProvider: React.FC = ({ children }) => {
    const baseInformationContext = useContext(ProjectBaseInformationContext);
    const web3Context = useContext(Web3Context);
    const account = useAccount();

    const [isApproving, setIsApproving] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isMutating, setIsMutating] = useState(false);
    const [serumIds, setSerumIds] = useState<number[]>([]);
    const [mutateWrapper, setMutateWrapper] = useState<MutateContractWrapper>();

    const checkInitialized = () => {
        if (!isInitialized) {
            throw new Error('Mutate not initialized');
        }
    }

    const getSerumIds = async (mutateWrapper: MutateContractWrapper, walletAddress: string) => {
        if (!mutateWrapper) {
            return;
        }

        const serumIds = await mutateWrapper.getSerumIds(walletAddress);
        setSerumIds(serumIds);
    }

    const init = async (opts: InitMutate): Promise<void> => {
        const baseInformation = baseInformationContext.getConfig(opts.serumContractAddress);

        if (!baseInformation.mutate) {
            throw new Error(`Project baseInformation does not contain mutate spec`);
        }

        const { web3 } = web3Context.getWeb3(resolveNetwork(baseInformation.network).networkId);
        const serumContract = new web3.eth.Contract(
            serumAbi,
            opts.serumContractAddress
        );

        const targetContract = new web3.eth.Contract(
            targetAbi,
            baseInformation.mutate.targetContractAddress
        );

        console.log('Init Mutate', opts.serumContractAddress);

        const mutateWrapper = new MutateContractWrapper(serumContract, targetContract, baseInformation);
        setMutateWrapper(mutateWrapper);

        if (account) {
            await getSerumIds(mutateWrapper, account.walletAddress);
        }

        setIsInitialized(true);
    }

    const mutate = async (serumTokenId: number): Promise<{ succeed: boolean, imageUrl?: string }> => {
        checkInitialized();

        if (!mutateWrapper || !account) {
            return { succeed: false };
        }

        setIsMutating(true);
        try {
            const res = await mutateWrapper.mutate(account.walletAddress, serumTokenId);
            await getSerumIds(mutateWrapper, account.walletAddress);
            return res;
        } finally {
            setIsMutating(false);
        }
    }

    const approveAll = async (): Promise<boolean> => {
        checkInitialized();

        if (!mutateWrapper || !account) {
            return false;
        }

        setIsApproving(true);
        try {
            const res = await mutateWrapper.approveAll(account.walletAddress);
            return res;
        } finally {
            setIsApproving(false);
        }
    }

    const isApproved = async (): Promise<boolean> => {
        checkInitialized();

        if (!mutateWrapper || !account) {
            return false;
        }

        return mutateWrapper.isApproved(account.walletAddress);
    }

    const contextValue: MutateContextType = {
        init,
        mutate,
        isApproved,
        approveAll,
        isApproving,
        isMutating,
        isInitialized,
        serumIds
    }

    return (
        <MutateContext.Provider value={contextValue}>
            {children}
        </MutateContext.Provider>
    );
}