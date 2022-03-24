import React, { useContext } from "react";
import styled from "styled-components";
import { AccountContext } from "../api/account/AccountContext";
import Button from "./Button";

const StyledNavBar = styled.nav`
    height: 80px;
    padding: 0 16px;
`;

const StyledImage = styled.img`
    width: 80%;
`

const toShortWallet = (walletAddr: string): string => {
    return [
        walletAddr.substring(0, 4),
        walletAddr.substring(walletAddr.length - 6)
    ].join('...');
}

export const NavBar: React.FC = () => {

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
        <StyledNavBar className="flex items-center justify-between">
            <div>
                <StyledImage src="/images/PotluckLabs_Logo.png" />
            </div>

            <div>
                <Button variant="outlined" onClick={handleConnectClick}>{connectButtonText}</Button>
            </div>
        </StyledNavBar>
    )
}