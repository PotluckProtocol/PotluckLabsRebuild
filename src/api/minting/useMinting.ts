import { useContext, useEffect, useState } from "react";
import useAccount from "../account/useAccount";
import { ProjectBaseInformation } from "../project-base-information/ProjectBaseInformation";
import { MintingContext, MintingContextType } from "./MintingContext";

export type UseMintingOpts = {
    liveMintingCount?: boolean;
    liveMintingState?: boolean;
}

export type UseMintingResult = {
    mintingContext: MintingContextType | null
    isInitialized: boolean;
}

export const useMinting = (baseInformation: ProjectBaseInformation, opts: UseMintingOpts = {}): UseMintingResult => {

    const [isInitialized, setIsInitialized] = useState(false);
    const mintingContext = useContext(MintingContext);
    const account = useAccount();

    const walletAddress = account?.walletAddress;
    const hasContract = !!baseInformation.contractAddress;
    const hasMintSpec = !!baseInformation.mint;

    useEffect(() => {
        const init = async () => {
            try {
                await mintingContext.init({
                    contractAddress: baseInformation.contractAddress,
                    liveMintingCount: opts.liveMintingCount,
                    liveMintingState: opts.liveMintingState
                });
            } catch (e) {
                console.error('Error on minting init', e);
                throw e;
            } finally {
                setIsInitialized(true);
            }
        }

        if (!hasContract || !hasMintSpec) {
            setIsInitialized(true);
            return;
        }

        if (!baseInformation.contractAddress) {
            setIsInitialized(true);
            return;
        }

        init();
    }, [baseInformation.contractAddress, walletAddress]);

    return {
        isInitialized,
        mintingContext: mintingContext.isInitialized ? mintingContext : null
    }

}