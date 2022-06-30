import { getChainInfos } from "./getChainInfos";
import { ProjectBaseInformation } from "./ProjectBaseInformation";

export const isCrossChainEligible = (baseInformation: ProjectBaseInformation): boolean => {
    if (!baseInformation.crossChainType || baseInformation.crossChainType === 'none') {
        return false;
    }
    return getChainInfos(baseInformation)
        .filter(item => !item.chainInfo.contractAddress)
        .length === 0;
}