import styled from "styled-components";
import { ConnectWalletButton } from "./ConnectWalletButton";
import { BiMenu } from "react-icons/bi";

const StyledNavBar = styled.nav`
    height: 80px;
    padding: 0 16px;
`;

const StyledImage = styled.img`
    width: 80%;
`

const BetaText = styled.span`
    font-weight: 600;
    font-size: .85rem;
    color: red;
`;

export type NavBarProps = {
    onMenuClick: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({
    onMenuClick
}) => {
    return (
        <StyledNavBar className="flex items-center justify-between">
            <div className="md:hidden">
                <button onClick={() => onMenuClick()}>
                    <BiMenu size={40} color="white" />
                </button>
            </div>
            <div className="flex items-center">
                <BetaText className="mr-3 md:hidden">BETA</BetaText>
                <StyledImage className="float-right md:float-none" src="/images/PotluckLabs_Logo.png" />
                <BetaText className="ml-3 hidden md:inline">BETA</BetaText>
            </div>

            <div className="hidden md:block">
                <ConnectWalletButton />
            </div>
        </StyledNavBar >
    )
}