
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { ethers } from 'ethers';
import { resolveNetwork } from "../network/resolveNetwork";
import { Account } from "./Account"
import WalletConnectProvider from '@walletconnect/web3-provider';
import { toast } from "react-toastify";

export type WalletType = 'MetaMask' | 'WalletConnect';

export type AccountContextType = {
    account: Account | null;
    connect: (walletType: WalletType) => Promise<void>;
    disconnect: () => Promise<void>;
    isConnecting: boolean;
    isInitialized: boolean;
}

const WALLET_CONNECT_KEY = 'walletconnect';
const WALLET_PROVIDER_KEY = 'walletProvider';

export const AccountContext = createContext<AccountContextType>(null as any);

export const AccountProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {

    const [account, setAccount] = useState<Account | null>(null);
    const [connecting, setConnecting] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    useEffect(() => {
        const connectWallet = async () => {
            const walletProvider: WalletType = localStorage?.getItem(WALLET_PROVIDER_KEY) as WalletType;
            if (walletProvider) {
                await connect(walletProvider);
            }

            setIsInitialized(true);
        }

        connectWallet();
    }, []);

    const connect = async (walletType: WalletType) => {
        setConnecting(true);
        try {

            let walletProvider: any;
            if (walletType === 'MetaMask') {
                const isMetaMask = (window as any).ethereum?.isMetaMask;
                if (!isMetaMask) {
                    toast('No MetaMask found', { type: 'error', theme: 'colored' });
                    return;
                }

                walletProvider = (window as any).ethereum as any;
            } else if (walletType === 'WalletConnect') {
                walletProvider = new WalletConnectProvider({
                    rpc: {
                        137: 'https://rpc-mainnet.matic.network',
                        250: 'https://rpc.ftm.tools/',
                        4002: 'https://rpc.testnet.fantom.network/',
                        43114: 'https://api.avax.network/ext/bc/C/rpc'
                    }
                });

                walletProvider.on('disconnect', () => {
                    window.location.reload();
                });

                // Pop up QRCode
                await walletProvider.enable();

            } else {
                throw new Error(`Unknown wallet type ${walletType}`);
            }

            const provider = new ethers.providers.Web3Provider(walletProvider);

            if (walletType === 'MetaMask') {
                await provider.send("eth_requestAccounts", []) as string[];
            }

            const signer = provider.getSigner();
            const walletAddress = await signer.getAddress();
            const networkId = await signer.getChainId();

            // Add listeners start
            walletProvider.on("accountsChanged", async (walletAddresses: string[]) => {
                if (walletAddresses[0]) {
                    window.location.reload();
                }
            });

            walletProvider.on("chainChanged", () => {
                window.location.reload();
            });

            console.log(`Using account: ${walletAddress} (Network: ${networkId})`);

            setAccount({
                network: resolveNetwork(networkId),
                walletAddress,
                signer
            });

            localStorage.setItem(WALLET_PROVIDER_KEY, walletType);
        } finally {
            setConnecting(false);
        }


    }

    const disconnect = async () => {
        localStorage.removeItem(WALLET_PROVIDER_KEY);
        localStorage.removeItem(WALLET_CONNECT_KEY);
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