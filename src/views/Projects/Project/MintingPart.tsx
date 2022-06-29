import moment from "moment";
import { ComponentPropsWithoutRef, ReactNode, useState } from "react";
import styled from "styled-components";
import useUser from "../../../api/account/useUser";
import { resolveChain } from "../../../api/network/resolveChain";
import { resolveNetwork } from "../../../api/network/resolveNetwork";
import { ChainProjectInformation, ProjectBaseInformation, ProjectChain } from "../../../api/project-base-information/ProjectBaseInformation"
import { NetworkIcon } from "../../../components/NetworkIcon";
import { MintProjectWrapper } from "../../Minting/MintProject/MintProjectWrapper";

export type MintingPartProps = {
    baseInformation: ProjectBaseInformation;
    className?: string;
}

const Container = styled.div``;

type TabItemButtomProps = ComponentPropsWithoutRef<'button'> & {
    active: boolean;
}

const TabItemButton = styled.button<TabItemButtomProps>`
    background-color: ${props => props.active ? '#0c6947' : 'none'};
    border: 1px solid ${props => props.active ? 'transparent' : '#0c6947'};
    transition: background-color 100ms linear;
    font-size: 1rem;
    font-weight: 600;
    border-radius: .25rem;
    padding: .4rem .75rem;
`;

const ComingSoonHeader = styled.p`
    font-size: 3rem;
    text-align: center;
    margin: 0 0 3rem;
`;

const ExternalLink = styled.a`
    color: #00f69d;
    text-decoration: underline;
`;

export const MintingPart: React.FC<MintingPartProps> = ({
    baseInformation,
    className
}) => {

    const user = useUser();
    const networkId = user.account?.network?.networkId;
    const primaryChain = Object.keys(baseInformation.chains)[0] as ProjectChain;
    const [selectedChain, setSelectedChain] = useState<ProjectChain>(networkId ? resolveChain(networkId) : primaryChain);

    const networks = Object.keys(baseInformation.chains).map(chain => resolveNetwork(chain));

    const renderTabs = () => {
        return (
            <ul className="flex justify-center items-center" role="tablist">
                {networks.map((network) => {
                    const chain = resolveChain(network.networkId);
                    return (
                        <li key={network.networkId} className="m-1 p-0">
                            <TabItemButton onClick={() => setSelectedChain(chain)} active={selectedChain === chain} className="flex items-center">
                                <NetworkIcon networkId={network.networkId} size={22} className='inline-block mx-0 mr-2' />
                                {network.name}
                            </TabItemButton>
                        </li>
                    );
                })}
            </ul>
        )
    }

    const renderMint = () => {
        const chainInfo = baseInformation.chains[selectedChain] as ChainProjectInformation;

        if (chainInfo.mint) {
            return (
                <MintProjectWrapper
                    contractAddress={chainInfo.contractAddress}
                />
            );
        } else {
            let timePart: ReactNode = <div>Public mint coming soon!</div>;
            if (baseInformation.releaseDate) {
                const m = moment(baseInformation.releaseDate)
                timePart = (
                    <>
                        <div>Public mint on</div>
                        <div>{`${m.utc().format('MMMM Do YYYY, h:mm A')} UTC`}</div>
                    </>
                );

                if (chainInfo.externalMintLocation) {
                    timePart = (
                        <>
                            {timePart}
                            <div>
                                On <ExternalLink href={chainInfo.externalMintLocation.url}>{chainInfo.externalMintLocation.name}</ExternalLink>
                            </div>
                        </>
                    );
                }
            }

            return (
                <ComingSoonHeader>{timePart}</ComingSoonHeader>
            );
        }
    }

    return (
        <Container className={className}>
            {renderTabs()}
            {renderMint()}
        </Container>
    )
}