import { useContext, useState } from "react";
import styled from "styled-components";
import { AccountContext, WalletType } from "../api/account/AccountContext";
import Button from "./Button";
import { ChooseWalletModal } from "./ChooseWalletModal";
import { NetworkIcon } from "./NetworkIcon";

const toShortWallet = (walletAddr: string): string => {
    return [
        walletAddr.substring(0, 4),
        walletAddr.substring(walletAddr.length - 4)
    ].join('...');
}

type ButtonGroupProps = {
    singleMode: boolean;
}

const ButtonGroup = styled.div<ButtonGroupProps>`
    ${props => (!props.singleMode) && `
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
    `}
`;

const NetworkButton = styled(Button)`
    padding: 0 6px;
`;

export const ConnectWalletButton: React.FC = () => {
    const accountContext = useContext(AccountContext);
    const [showChooseWalletModal, setShowChooseWalletModal] = useState(false);

    const handleButtonClick = () => {
        if (accountContext.account) {
            accountContext.disconnect();
        } else {
            setShowChooseWalletModal(true);
        }
    }

    const handleWalletTypeChosen = (walletType: WalletType) => {
        accountContext.connect(walletType);
        setShowChooseWalletModal(false);
    }

    let connectButtonText = 'Connect Wallet';
    if (accountContext.isConnecting) {
        connectButtonText = 'Connecting...';
    } else if (!!accountContext.account) {
        connectButtonText = toShortWallet(accountContext.account.walletAddress);
    }

    // Single button mode if there is no account connected
    const useSingleButtonMode = !accountContext.account;

    return (
        <div>
            <ButtonGroup singleMode={useSingleButtonMode} className="flex justify-center items-center">
                <Button variant="outlined" onClick={handleButtonClick}>
                    {connectButtonText}
                </Button>
                {(!!accountContext.account) && (
                    <NetworkButton>
                        <NetworkIcon networkId={accountContext.account.network.networkId} size={30} />
                    </NetworkButton>
                )}
            </ButtonGroup>

            {showChooseWalletModal && (<ChooseWalletModal onClose={() => setShowChooseWalletModal(false)} onWalletChosen={handleWalletTypeChosen} />)}
        </div>
    )
}