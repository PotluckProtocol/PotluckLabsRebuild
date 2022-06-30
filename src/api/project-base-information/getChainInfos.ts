import { ChainProjectInformation, ProjectBaseInformation, ProjectChain } from "./ProjectBaseInformation";

export type ChainInfoItem = { chain: ProjectChain, chainInfo: ChainProjectInformation }

export const getChainInfos = (baseInformation: ProjectBaseInformation): ChainInfoItem[] => {
    return Object.keys(baseInformation.chains).map(chain => {
        return {
            chain: chain as ProjectChain,
            chainInfo: baseInformation.chains[chain as ProjectChain]
        } as ChainInfoItem;
    });
}