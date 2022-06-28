import { useEffect } from "react"
import { NavLink } from "react-router-dom"
import styled from "styled-components"
import { useMinting } from "../../../api/minting/useMinting"
import { resolveNetwork } from "../../../api/network/resolveNetwork"
import { SingletonProjectBaseInformation, ProjectBaseInformation, ProjectChain } from "../../../api/project-base-information/ProjectBaseInformation"
import { MultipleNetworkIcons } from "../../../components/MultipleNetworkIcons"
import { NetworkIcon } from "../../../components/NetworkIcon"
import { TextFit } from "../../../components/TextFit"
import { useProjectBasicMintInfo } from "../../../hooks/useProjectBasicMintInfo"

export type ProjectItemProps = {
    baseInformation: ProjectBaseInformation;
    onMintStateResolved: (projectId: string, isCurrentlyMinting: boolean) => void;
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

const ItemCountLabelSpacer = styled.div`
    height: 20px;
`;

const ItemCountLabel = styled.div`
    font-size: .8rem;
    position: absolute;
    bottom: .5rem;
    right: 1rem;
`;

export const ProjectItem: React.FC<ProjectItemProps> = ({
    baseInformation,
    onMintStateResolved
}) => {
    //  const { isInitialized: mintingIsInitialized, mintingContext } = useMinting(baseInformation);
    const [isLoadingBasicMintInfo, mintInfoMap] = useProjectBasicMintInfo(baseInformation.id);

    const mintStatusArray = Object.keys(mintInfoMap || {})
        .map(chain => mintInfoMap?.[chain as ProjectChain]?.mintState)
        .filter(Boolean);

    useEffect(() => {
        if (isLoadingBasicMintInfo) {
            return;
        }

        const mintStateOpen = (mintStatusArray.includes('WhitelistOpen') || mintStatusArray.includes('Open'));
        if (mintStateOpen) {
            onMintStateResolved(baseInformation.id, true);
        }
    }, [isLoadingBasicMintInfo, mintInfoMap]);

    if (isLoadingBasicMintInfo) {
        return null;
    }

    let supplyAcrossAllChains = 0;
    Object.keys(baseInformation.chains).forEach(chain => {
        const chainInfo = baseInformation.chains[chain as ProjectChain];
        supplyAcrossAllChains += chainInfo?.initialSupply || 0;
    });

    const showMintingCount = (mintStatusArray.includes('WhitelistOpen') || mintStatusArray.includes('Open'));

    let leftToBeMinted: number = 0;
    if (showMintingCount) {
        let mintedTotalAcrossAllChains = 0;
        Object.keys(mintInfoMap).forEach(chain => {
            const chainInfo = mintInfoMap[chain as ProjectChain];
            if (chainInfo) {
                mintedTotalAcrossAllChains += chainInfo.mintCount;
            }
        });

        leftToBeMinted = supplyAcrossAllChains - mintedTotalAcrossAllChains;
    }

    const networkIds = Object.keys(baseInformation.chains).map(chain => resolveNetwork(chain).networkId);

    return (
        <NavLinkContainer to={`/projects/${baseInformation.id}`}>
            <CoverImage src={baseInformation.coverImage} />
            {(showMintingCount && leftToBeMinted > 0) && (
                <PositionedMintingBadge>
                    <span style={{ fontWeight: 800, fontSize: '.95rem', lineHeight: '.95rem' }}>{leftToBeMinted}</span>
                    <span style={{ fontSize: '.7rem', lineHeight: '.7rem' }}>&nbsp;left</span>
                </PositionedMintingBadge>
            )}
            <MultipleNetworkIcons size={35} networkIds={networkIds} />
            <Content>
                <Title height={30} className="my-2">{baseInformation.name}</Title>
                <ItemCountLabelSpacer className="flex items-end justify-end">
                    <ItemCountLabel>{supplyAcrossAllChains === 0 ? (<>TBA</>) : (<><b>{supplyAcrossAllChains}</b> pieces</>)}</ItemCountLabel>
                </ItemCountLabelSpacer>
            </Content>
        </NavLinkContainer>
    )
}