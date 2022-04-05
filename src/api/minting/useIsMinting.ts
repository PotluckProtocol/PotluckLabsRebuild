import { useContext, useEffect } from "react"
import useProjectBaseInformation from "../project-base-information/useProjectBaseInformation";
import { MintingContext } from "./MintingContext"

export const useIsMinting = (contractAddressOrNameIdent: string): boolean | null => {
    const mintingContext = useContext(MintingContext);
    const baseInformation = useProjectBaseInformation(contractAddressOrNameIdent);
    useEffect(() => {
        const init = async () => {
            if (baseInformation.contractAddress && baseInformation.mint) {
                await mintingContext.init({
                    contractAddress: baseInformation.contractAddress,
                    liveMintingCount: false
                });
            }
        }

        init();
    }, [baseInformation.contractAddress, baseInformation.mint]);

    if (!baseInformation.mint || !baseInformation.contractAddress) {
        return false;
    }


    if (!mintingContext || !mintingContext.isInitialized) {
        return null;
    }

    return (
        mintingContext.mintState === 'Open' ||
        mintingContext.mintState === 'WhitelistOpen'
    );
}