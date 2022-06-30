import { sum } from "lodash";
import { MintState } from "../../../api/minting/MintingContractWrapper";
import { ProjectChain } from "../../../api/project-base-information/ProjectBaseInformation";
import { BasicMintInfoMap } from "../../../hooks/useProjectBasicMintInfo";

export const getCrossChainMintState = (
    basicMintInfoMap: BasicMintInfoMap,
    projectMaxSupply: number
): 'SoldOut' | 'Minting' | 'None' => {
    const chainMintStates: MintState[] = [];
    const chainMintCounts: number[] = [];
    Object.keys(basicMintInfoMap)
        .forEach(chain => {
            const chainMintInfo = basicMintInfoMap[chain as ProjectChain];
            if (chainMintInfo) {
                chainMintStates.push(chainMintInfo.mintState);
                chainMintCounts.push(chainMintInfo.mintCount);
            }
        });

    const isSoldOut = chainMintStates.filter(state => state === 'Ended').length === chainMintStates.length || sum(chainMintCounts) >= projectMaxSupply;
    if (isSoldOut) {
        return 'SoldOut';
    }

    const isMinting = chainMintStates.includes('WhitelistOpen') || chainMintStates.includes('Open');
    if (isMinting) {
        return 'Minting';
    }

    return 'None';
};