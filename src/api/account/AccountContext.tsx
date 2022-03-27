import { createContext, useContext, useState } from "react";
import Web3 from 'web3';
import { Web3Context } from "../web3/Web3Context";
import { Account } from "./Account"

export type AccountContextType = {
    account: Account | null;
    connect: () => Promise<void>;
    isConnecting: boolean;
}

export const AccountContext = createContext<AccountContextType>(null as any);

export const AccountProvider: React.FC = ({ children }) => {

    const web3Context = useContext(Web3Context);
    const [account, setAccount] = useState<Account>();
    const [connecting, setConnecting] = useState<boolean>(false);

    const connect = async () => {

        const isMetaMask = (window as any).ethereum?.isMetaMask;
        if (isMetaMask) {
            setConnecting(true);

            const ethereum = (window as any).ethereum as any;
            const web3Instance = new Web3(ethereum);

            const [walletAddress] = await ethereum.request({
                method: "eth_requestAccounts",
            }) as string[];

            const networkId = Number(
                await ethereum.request({
                    method: "net_version",
                })
            );

            // Add listeners start
            ethereum.on("accountsChanged", (walletAddresses: string[]) => {
                if (account) {
                    const wallet = walletAddresses[0];
                    console.log(`Account changed: ${wallet} (Network: ${networkId})`);
                    setAccount({
                        ...account,
                        walletAddress: wallet
                    });
                }
            });
            ethereum.on("chainChanged", () => {
                window.location.reload();
            });

            console.log(`Using account: ${walletAddress} (Network: ${networkId})`);

            web3Context.setWeb3(networkId, web3Instance);

            setAccount({
                walletAddress,
                network: {
                    id: networkId
                }
            });

            setConnecting(false);
        }
    }

    const contextValue: AccountContextType = {
        account: account || null,
        isConnecting: connecting,
        connect
    }

    return (
        <AccountContext.Provider value={contextValue}>
            {children}
        </AccountContext.Provider>
    );
}