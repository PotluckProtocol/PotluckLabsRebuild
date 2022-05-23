import styled from "styled-components";
import { WalletType } from "../api/account/AccountContext"
import Button from "./Button";

const ICONS: Record<WalletType, string> = {
    'MetaMask': '/images/wallet-icons/metamask.svg',
    'WalletConnect': '/images/wallet-icons/walletconnect.svg'
}

export type WalletButtonProps = {
    type: WalletType
}

const ButtonGroup = styled.div`
    button:not(:last-child) {
        border-right: 0;
    }

    button:first-child {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0; 
    }

    button:last-child {
        border-right: inherit;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0; 
    }
`;

export const WalletButton: React.FC<WalletButtonProps> = ({
    type
}) => {
    return (
        <Button variant="outlined">
            {type}
        </Button>
    )
}