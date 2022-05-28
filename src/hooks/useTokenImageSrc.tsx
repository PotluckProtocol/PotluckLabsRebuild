import { ethers } from "ethers";
import { useEffect, useState } from "react"
import useUser from "../api/account/useUser";
import { MetadataContractWrapper } from "../api/traversing/MetadataContractWrapper";
import { abi } from "../views/Minting/abi";

export type UseTokenImageSrcOpts = {
    contractAddress?: string;
    networkId?: number;
    tokenId?: number;
} | null;

export const useTokenImageSrc = (opts: UseTokenImageSrcOpts): [boolean, string | null] => {
    const { contractAddress, networkId, tokenId } = opts || {};

    const user = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [tokenImageSrc, setTokenImageSrc] = useState<string | null>(null);

    useEffect(() => {
        const findTokenSrc = async () => {
            if (contractAddress && typeof tokenId === 'number' && typeof networkId === 'number') {
                setIsLoading(true);
                try {
                    const contract = new ethers.Contract(contractAddress, abi, user.getSignerOrProvider(networkId));
                    const wrapper = new MetadataContractWrapper(contract);
                    const imageSrc = await wrapper.getTokenImageSrc(tokenId);
                    setTokenImageSrc(imageSrc);
                } finally {
                    setIsLoading(false);
                }
            }
        }

        findTokenSrc();
    }, [contractAddress, networkId, tokenId]);

    return [isLoading, tokenImageSrc];
}