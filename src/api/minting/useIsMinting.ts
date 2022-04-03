import { useContext, useEffect } from "react"
import { MintingContext } from "./MintingContext"

export const useIsMinting = (contractAddress: string): boolean | null => {
    const mintingContext = useContext(MintingContext);

    useEffect(() => {
        const init = async () => {
            await mintingContext.init({
                contractAddress,
                liveMintingCount: false
            });
        }

        init();
    }, [contractAddress]);

    if (!mintingContext || !mintingContext.isInitialized) {
        return null;
    }

    return (
        mintingContext.mintState === 'Open' ||
        mintingContext.mintState === 'WhitelistOpen'
    );
}