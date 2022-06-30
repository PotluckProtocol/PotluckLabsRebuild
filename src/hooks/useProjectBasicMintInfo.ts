import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import useUser from "../api/account/useUser";
import { MintingContractWrapper, MintingContractWrapperOpts, MintState } from "../api/minting/MintingContractWrapper";
import { resolveNetwork } from "../api/network/resolveNetwork";
import { getSingletonProjectBaseInformation } from "../api/project-base-information/getSingletonProjectBaseInformation";
import { ChainProjectInformation, ProjectChain } from "../api/project-base-information/ProjectBaseInformation";
import { ProjectBaseInformationContext } from "../api/project-base-information/ProjectBaseInformationContext";
import { abi } from "../views/Minting/abi";

export type BasicMintInfoMap = Partial<Record<ProjectChain, { mintState: MintState, mintCount: number }>>;

const MINTING_CONTRACT_WRAPPER_OPTS: MintingContractWrapperOpts = {
    liveMintingCount: false,
    liveMintStateRefresh: false
}

export const useProjectBasicMintInfo = (projectId: string): ([true, null] | [false, BasicMintInfoMap]) => {
    const [isLoading, setIsLoading] = useState(false);
    const [basicInfoMap, setBasicInfoMap] = useState<BasicMintInfoMap>({});
    const baseInformationContext = useContext(ProjectBaseInformationContext);
    const user = useUser();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const baseInformation = baseInformationContext.getConfig(projectId);
            const newBasicInfoMap: BasicMintInfoMap = {};
            const fetchPromises = Object.keys(baseInformation.chains).map(
                async (chain) => {
                    const projectChain = chain as ProjectChain;
                    const chainInfo = baseInformation.chains[projectChain] as ChainProjectInformation;
                    if (!chainInfo.contractAddress) {
                        return;
                    }

                    const contract = new ethers.Contract(
                        chainInfo.contractAddress,
                        abi,
                        user.getSignerOrProvider(resolveNetwork(chain).networkId)
                    );
                    const mintingWrapper = new MintingContractWrapper(
                        contract,
                        getSingletonProjectBaseInformation(baseInformation, projectChain),
                        MINTING_CONTRACT_WRAPPER_OPTS
                    );

                    const [mintCount, mintState] = await Promise.all([
                        mintingWrapper.getMintedCount(),
                        mintingWrapper.getMintState()
                    ]);

                    newBasicInfoMap[projectChain] = {
                        mintCount,
                        mintState
                    };
                }
            );

            await Promise.all(fetchPromises);
            setBasicInfoMap(newBasicInfoMap);
            setIsLoading(false);
        }

        fetchData();
    }, [projectId]);

    return isLoading
        ? [true, null]
        : [false, basicInfoMap];
}