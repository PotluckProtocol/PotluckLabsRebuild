import { useContext } from "react";
import { AccountContext } from "../api/account/AccountContext";
import Button from "./Button";

const toShortWallet = (walletAddr: string): string => {
    return [
        walletAddr.substring(0, 4),
        walletAddr.substring(walletAddr.length - 6)
    ].join('...');
}

export const ConnectWalletButton: React.FC = () => {
    const accountContext = useContext(AccountContext);

    const handleConnectClick = () => {
        accountContext.connect();
    }

    let connectButtonText = 'Connect Wallet';
    if (accountContext.isConnecting) {
        connectButtonText = 'Connecting...';
    } else if (accountContext.account) {
        connectButtonText = toShortWallet(accountContext.account.walletAddress);
    }

    return (
        <Button variant="outlined" onClick={handleConnectClick}>
            {connectButtonText}
        </Button>
    )
}