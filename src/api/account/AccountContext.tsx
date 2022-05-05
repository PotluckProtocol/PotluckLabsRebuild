
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { ethers } from 'ethers';
import { resolveNetwork } from "../network/resolveNetwork";
import { Account } from "./Account"

export type AccountContextType = {
    account: Account | null;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    isConnecting: boolean;
    isInitialized: boolean;
}

const WALLET_PROVIDER_KEY = 'walletProvider';

export const AccountContext = createContext<AccountContextType>(null as any);

export const AccountProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {

    const [account, setAccount] = useState<Account | null>(null);
    const [connecting, setConnecting] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    useEffect(() => {
        const connectWallet = async () => {
            const ethereum = (window as any).ethereum as any;
            if (ethereum && ethereum.isMetaMask) {
                if (localStorage?.getItem(WALLET_PROVIDER_KEY) === 'metamask') {
                    await connect();
                }
            }

            setIsInitialized(true);
        }

        connectWallet();
    }, []);

    const connect = async () => {

        const isMetaMask = (window as any).ethereum?.isMetaMask;
        if (isMetaMask) {
            setConnecting(true);

            const ethereum = (window as any).ethereum as any;
            const provider = new ethers.providers.Web3Provider(ethereum);

            await provider.send("eth_requestAccounts", []) as string[];

            const signer = provider.getSigner();

            const walletAddress = await signer.getAddress();
            const networkId = await signer.getChainId();

            // Add listeners start
            ethereum.on("accountsChanged", async (walletAddresses: string[]) => {
                if (walletAddresses[0]) {
                    window.location.reload();
                }
            });

            ethereum.on("chainChanged", () => {
                window.location.reload();
            });

            console.log(`Using account: ${walletAddress} (Network: ${networkId})`);

            setAccount({
                network: resolveNetwork(networkId),
                walletAddress,
                signer
            });

            localStorage.setItem(WALLET_PROVIDER_KEY, 'metamask');

            setConnecting(false);
        }
    }

    const disconnect = async () => {
        localStorage.removeItem(WALLET_PROVIDER_KEY);
        setAccount(null);
        window.location.reload();
    }

    const contextValue: AccountContextType = {
        account: account || null,
        isConnecting: connecting,
        isInitialized,
        connect,
        disconnect
    }

    return (
        <AccountContext.Provider value={contextValue}>
            {children}
        </AccountContext.Provider>
    );
}