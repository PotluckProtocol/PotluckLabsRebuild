import { createContext, useContext, useEffect, useState } from "react";
import Web3 from 'web3';
import { Web3Context } from "../web3/Web3Context";
import { Account } from "./Account"

export type AccountContextType = {
    account: Account | null;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    isConnecting: boolean;
}

const WALLET_PROVIDER_KEY = 'walletProvider';

export const AccountContext = createContext<AccountContextType>(null as any);

export const AccountProvider: React.FC = ({ children }) => {

    const web3Context = useContext(Web3Context);
    const [account, setAccount] = useState<Account>();
    const [connecting, setConnecting] = useState<boolean>(false);

    useEffect(() => {
        if (localStorage.getItem(WALLET_PROVIDER_KEY)) {
            connect();
        }
    }, []);

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
                if (walletAddresses[0]) {
                    window.location.reload();
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

            localStorage.setItem(WALLET_PROVIDER_KEY, 'metamask');

            setConnecting(false);
        }
    }

    const disconnect = async () => {
        setAccount(null as any);
        localStorage.removeItem(WALLET_PROVIDER_KEY);
        window.location.reload();
    }

    const contextValue: AccountContextType = {
        account: account || null,
        isConnecting: connecting,
        connect,
        disconnect
    }

    return (
        <AccountContext.Provider value={contextValue}>
            {children}
        </AccountContext.Provider>
    );
}