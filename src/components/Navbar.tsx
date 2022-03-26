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
            <div>
                <StyledImage className="float-right md:float-none" src="/images/PotluckLabs_Logo.png" />
            </div>

            <div className="hidden md:block">
                <ConnectWalletButton />
            </div>
        </StyledNavBar >
    )
}