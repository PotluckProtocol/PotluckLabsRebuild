import { useContext, useEffect, useState } from "react";
import Web3 from "web3";
import useAccount from "../../../api/account/useAccount"
import { abi } from "../../../api/stores/abi";
import { ERC20TokenWrapper } from "../../../api/stores/ERC20TokenWrapper";
import { Web3Context } from "../../../api/web3/Web3Context";
import useInterval from "../../../hooks/useInterval";
import { weiToNumber } from "../../../utils/wei-to-display-cost";
import { LABS_CONTRACT_ADDRESSES, LABS_TOKEN } from "./Labs";


export type UseLabsBalanceResult = {
    isLoading: boolean;
    balance: number;
}

export const useLabsBalance = (): UseLabsBalanceResult => {
    const account = useAccount();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [balance, setBalance] = useState<number>(0);
    const web3Context = useContext(Web3Context);

    const walletAddress = account?.walletAddress;
    const networkId = account?.network?.id;

    const fetchWalletBalance = async (loadingIndicator: boolean = true) => {
        if (walletAddress && networkId) {
            const labsContract = LABS_CONTRACT_ADDRESSES[networkId];
            const { web3 } = web3Context.getWeb3(networkId);

            if (loadingIndicator) {
                setIsLoading(true);
            }

            const wrapper = new ERC20TokenWrapper(
                new web3.eth.Contract(abi, labsContract)
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