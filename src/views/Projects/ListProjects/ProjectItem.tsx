import { useContext, useEffect } from "react"
import { NavLink } from "react-router-dom"
import styled from "styled-components"
import useAccount from "../../../api/account/useAccount"
import { MintingContext } from "../../../api/minting/MintingContext"
import { useMinting } from "../../../api/minting/useMinting"
import { resolveNetwork } from "../../../api/network/resolveNetwork"
import { ProjectBaseInformation } from "../../../api/project-base-information/ProjectBaseInformation"
import { resolveIdentInfo } from "../../../api/project-base-information/ProjectBaseInformationContext"
import { NetworkIcon } from "../../../components/NetworkIcon"
import { TextFit } from "../../../components/TextFit"

export type ProjectItemProps = {
    baseInformation: ProjectBaseInformation
}

const NavLinkContainer = styled(NavLink)`
    position: relative;
    background: rgb(3,26,18);
    background: linear-gradient(0deg, rgba(3,26,18,1) 0%, rgba(12,105,71,1) 100%);
    text-align: center;
    padding: 0.5rem;
    border-radius: 1.5rem;
 
    &:hover {
        outline: #1bf2a4 2px solid;
    }
`;

const PositionedNetworkIcon = styled(NetworkIcon)`
    display: inline-block;
    position: absolute;
    right: 0.35rem;
    top: 0.35rem;
`;

const PositionedMintingBadge = styled.div`
    display: inline-block;
    position: absolute;
    left: 0.35rem;
    top: 0.35rem;
    padding: .5rem;
    height: 35px;
    border-radius: 1rem;
    background-color:  #1bf2a4;
    color: #000;
    font-weight: 500;
    display: flex;
    align-items: center;
`;

const CoverImage = styled.img`
    border-radius: 1rem;
    box-shadow: rgba(27, 242, 165, 0.2) 1px 1px 10px 1px;
`;

const Content = styled.div`
    padding: 0.5rem 0.5rem 0;
`;

const Title = styled(TextFit)`
    font-weight: 800;
    color: #1bf2a4;
`;

const ItemCountLabel = styled.div`
    font-size: .8rem;
`;

export const ProjectItem: React.FC<ProjectItemProps> = ({
    baseInformation
}) => {
    const projectNavPart = resolveIdentInfo(baseInformation);
    const { isInitialized: mintingIsInitialized, mintingContext } = useMinting(baseInformation);

    if (!mintingIsInitialized) {
        return <>'loading'</>;
    }

    const showMintingCount = (
        mintingContext &&
        ['WhitelistOpen', 'Open'].includes(mintingContext.mintState)
    );
    let leftToBeMinted: number | undefined;
    if (showMintingCount) {
        leftToBeMinted = baseInformation.maxSupply - mintingContext.mintCount;
    }

    return (
        <NavLinkContainer to={`/projects/${projectNavPart}`}>
            <CoverImage src={baseInformation.coverImage} />
            {showMintingCount && (
                <PositionedMintingBadge>
                    <span style={{ fontWeight: 800, fontSize: '.95rem', lineHeight: '.95rem' }}>{leftToBeMinted}</span>
                    <span style={{ fontSize: '.7rem', lineHeight: '.7rem' }}>&nbsp;left</span>
                </PositionedMintingBadge>
            )}
            <PositionedNetworkIcon size={35} networkId={resolveNetwork(baseInformation.network).networkId} />
            <Content>
                <Title height={30} className="my-2">{baseInformation.name}</Title>
                <div className="flex items-end justify-end">
                    <ItemCountLabel><b>{baseInformation.maxSupply}</b> pieces</ItemCountLabel>
                </div>
            </Content>
        </NavLinkContainer>
    )
}