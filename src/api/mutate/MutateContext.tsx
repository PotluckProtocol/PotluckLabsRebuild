import { createContext, useState, useContext, useEffect } from "react";
import useUser from "../account/useUser";
import { ProjectBaseInformationContext } from "../project-base-information/ProjectBaseInformationContext";
import { MutateContractWrapper } from "./MutateContractWrapper";
import { resolveNetwork } from "../network/resolveNetwork";
import { serumAbi } from "./abis/serum";
import { targetAbi } from "./abis/target";
import { ethers } from "ethers";

export type InitMutate = {
    serumContractAddress: string;
}

export const MAX_SERUMS_IDS_LOADED = 10;

export type MutateContextType = {
    init: (opts: InitMutate) => Promise<void>;
    approveAll: () => Promise<boolean>;
    isApproved: () => Promise<boolean>;
    mutate: (serumTokenId: number) => Promise<{ succeed: boolean, imageUrl?: string }>;

    isApproving: boolean;
    isMutating: boolean;
    isInitialized: boolean;

    serumBalance: number;
    serumIds: number[];
}

export const MutateContext = createContext<MutateContextType>(null as any);

export const MutateProvider: React.FC = ({ children }) => {
    const baseInformationContext = useContext(ProjectBaseInformationContext);
    const user = useUser();

    const [isApproving, setIsApproving] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isMutating, setIsMutating] = useState(false);
    const [serumBalance, setSerumBalance] = useState(0);
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

        const { ids, totalBalance } = await mutateWrapper.getSerumIds(walletAddress, MAX_SERUMS_IDS_LOADED);

        setSerumIds(ids);
        setSerumBalance(totalBalance);
    }

    const init = async (opts: InitMutate): Promise<void> => {
        const baseInformation = baseInformationContext.getConfig(opts.serumContractAddress);

        if (!baseInformation.mutate) {
            throw new Error(`Project baseInformation does not contain mutate spec`);
        }

        const signerOrProvider = user.getSignerOrProvider(resolveNetwork(baseInformation.network).networkId);

        const serumContract = new ethers.Contract(opts.serumContractAddress, serumAbi, signerOrProvider);
        const targetContract = new ethers.Contract(baseInformation.mutate.targetContractAddress, targetAbi, signerOrProvider);

        console.log('Init Mutate', opts.serumContractAddress);

        const mutateWrapper = new MutateContractWrapper(serumContract, targetContract, baseInformation);
        setMutateWrapper(mutateWrapper);

        if (user.account) {
            await getSerumIds(mutateWrapper, user.account.walletAddress);
        }

        setIsInitialized(true);
    }

    const mutate = async (serumTokenId: number): Promise<{ succeed: boolean, imageUrl?: string }> => {
        checkInitialized();

        if (!mutateWrapper || !user.account) {
            return { succeed: false };
        }

        const { walletAddress } = user.account;

        setIsMutating(true);
        try {
            const res = await mutateWrapper.mutate(walletAddress, serumTokenId);

            const newSerumIds = serumIds.filter(id => id !== serumTokenId);
            setSerumBalance(serumBalance - 1);
            setSerumIds(newSerumIds);

            if (newSerumIds.length === 0) {
                await getSerumIds(mutateWrapper, walletAddress);
            }

            return res;
        } finally {
            setIsMutating(false);
        }
    }

    const approveAll = async (): Promise<boolean> => {
        checkInitialized();

        if (!mutateWrapper || !user.account) {
            return false;
        }

        setIsApproving(true);
        try {
            const res = await mutateWrapper.approveAll(user.account.walletAddress);
            return res;
        } finally {
            setIsApproving(false);
        }
    }

    const isApproved = async (): Promise<boolean> => {
        checkInitialized();

        if (!mutateWrapper || !user.account) {
            return false;
        }

        return mutateWrapper.isApproved(user.account.walletAddress);
    }

    const contextValue: MutateContextType = {
        init,
        mutate,
        isApproved,
        approveAll,
        isApproving,
        isMutating,
        isInitialized,
        serumIds,
        serumBalance
    }

    return (
        <MutateContext.Provider value={contextValue}>
            {children}
        </MutateContext.Provider>
    );
}