import { ethers } from "ethers";
import { useEffect, useState } from "react";
import useUser from "../../../api/account/useUser";
import { abi } from "../../../api/stores/abi";
import { ERC20TokenWrapper } from "../../../api/stores/ERC20TokenWrapper";
import useInterval from "../../../hooks/useInterval";
import { weiToNumber } from "../../../utils/wei-to-display-cost";
import { LABS_CONTRACT_ADDRESSES, LABS_TOKEN } from "./Labs";

export type UseLabsBalanceResult = {
    isLoading: boolean;
    balance: number;
}

export const useLabsBalance = (): UseLabsBalanceResult => {
    const user = useUser();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [balance, setBalance] = useState<number>(0);

    const walletAddress = user.account?.walletAddress;
    const networkId = user.account?.network.networkId;

    const fetchWalletBalance = async (loadingIndicator: boolean = true) => {
        if (walletAddress && networkId) {
            const labsContract = LABS_CONTRACT_ADDRESSES[networkId];

            if (loadingIndicator) {
                setIsLoading(true);
            }

            const wrapper = new ERC20TokenWrapper(
                new ethers.Contract(labsContract, abi, user.getSignerOrProvider(networkId))
            );

            const balance = await wrapper.balanceOf(walletAddress);

            setBalance(weiToNumber(balance, LABS_TOKEN));
            setIsLoading(false);
        }
    }

    useInterval(() => {
        fetchWalletBalance(false);
    }, 5000);

    useEffect(() => {
        fetchWalletBalance();
    }, [walletAddress, networkId]);

    return {
        isLoading,
        balance
    }
}