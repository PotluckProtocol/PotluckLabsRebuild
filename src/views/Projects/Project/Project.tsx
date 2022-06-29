import { ReactNode, useContext, useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import styled from "styled-components";
import { Artist } from "../../../api/artists/Artist";
import { ImageCarousel } from "../../../components/ImageCarousel";
import { ImageWithPreview } from "../../../components/ImageWithPreview";
import { Tab, Tabs } from "../../../components/Tabs"
import { MintProjectWrapper } from "../../Minting/MintProject/MintProjectWrapper";
import { ArtistsBio } from "./ArtistsBio";
import { Attributions } from "./Attributions";
import { resolveNetwork } from "../../../api/network/resolveNetwork";
import { SecMarketLink } from "./SecMarketLink";
import { ProjectBaseInformationContext } from "../../../api/project-base-information/ProjectBaseInformationContext";
import { useProjectBasicMintInfo } from "../../../hooks/useProjectBasicMintInfo";
import { ProjectChain } from "../../../api/project-base-information/ProjectBaseInformation";
import { MintingPart } from "./MintingPart";

const DEFAULT_ROADMAP_IMAGE_PATH = '/images/main_roadmap.png';

const Title = styled.h1`
    color: #1bf2a4;
    font-size: 3rem;
    line-height: 100%;
    margin-bottom: 2rem;
    font-weight: 900;
`;

const Paragraph = styled.p`
    color: #bdd0c9;
    margin-bottom: 1rem;
    text-align: justify;
`;

const ExternalButton = styled.button`
    border: 1px solid #1bf2a4;
    background: none;
    color:#1bf2a4;
    font-size: 1rem;
    padding: .25rem .5rem;
    border-radius: .5rem;
`;



type RouteParams = {
    contractAddressOrNameIdent: string;
}

const getMiddleIndex = (count: number): number | undefined => {
    if (count === 0) {
        return undefined;
    } else if (count === 1 || count === 2) {
        return 0;
    } else {
        return Math.round(count / 2) - 1
    }
}

const fixUrl = (url: string, path: string): string => {
    url = url.endsWith('/') ? url : `${url}/`;
    path = path.startsWith('/') ? path.substring(1) : path;
    return url + path;
}

export const Project: React.FC = () => {
    const { contractAddressOrNameIdent } = useParams<RouteParams>();
    const baseInformationContext = useContext(ProjectBaseInformationContext);
    const baseInformation = baseInformationContext.getConfig(contractAddressOrNameIdent || '');
    const artistsTabVisible = !!baseInformation.artists?.length;
    const [queryParams, setQueryParams] = useSearchParams();
    const [selectedTab, setSelectedTab] = useState('');

    const [isLoadingBasicMintInfo, basicMintInfoMap] = useProjectBasicMintInfo(baseInformation.id);

    useEffect(() => {
        if (queryParams.has('tab')) {
            setSelectedTab(queryParams.get('tab') as string);
        }
    });

    const handleTabChange = (tabId: string) => {
        setSelectedTab(tabId);
        setQueryParams({ tab: tabId });
    }

    let description: ReactNode = null;
    if (baseInformation.description && baseInformation.description.length > 0) {
        const arr = Array.isArray(baseInformation.description) ? baseInformation.description : [baseInformation.description];
        description = arr.map((text, index) => (
            <Paragraph key={index} children={text} />
        ));
    }

    const attributionsTabVisible = !!baseInformation.attributions?.length;
    const artistsTabHeaderText = baseInformation.artists?.length === 1 ? 'Artist' : 'Artists';

    const roadmapImageUrl = baseInformation.roadmapImage
        ? baseInformation.roadmapImage
        : DEFAULT_ROADMAP_IMAGE_PATH;

    if (isLoadingBasicMintInfo) {
        return <div>Loading</div>
    }

    const isMinting = Object.keys(basicMintInfoMap)
        .map(chain => {
            const mintState = basicMintInfoMap[chain as ProjectChain]?.mintState;
            return mintState === 'Open' || mintState === 'WhitelistOpen';
        })
        .filter(Boolean)
        .length > 0;



    const renderSecondaryMarketLinks = () => {
        if (baseInformation.secondaryMarketplace?.NFTKey) {
            if (baseInformation.secondaryMarketplace?.NFTKey) {
                return (
                    <SecMarketLink nftKey={baseInformation.secondaryMarketplace.NFTKey}>
                        <ExternalButton>NFTKey</ExternalButton>
                    </SecMarketLink>
                );
            }
        }
    }

    const renderBlockchainExplorerLinks = () => {
        return (
            <>
                {Object.keys(baseInformation.chains).map(chain => {
                    const chainInfo = baseInformation.chains[chain as ProjectChain];
                    if (!chainInfo?.contractAddress) {
                        return null;
                    }

                    const { blockchainExplorer } = resolveNetwork(chain);
                    return (
                        <a key={chain} href={fixUrl(blockchainExplorer.url, `address/${chainInfo.contractAddress}`)} target="_blank">
                            <ExternalButton>{blockchainExplorer.name}</ExternalButton>
                        </a>
                    );
                })}
            </>
        );

    }

    return (
        <>
            <MintingPart baseInformation={baseInformation} />

            {(baseInformation.images || []).length > 0 && (
                <div className="mb-10">
                    <p className="text-center mb-2">Preview pieces from the collection</p>
                    <ImageCarousel
                        images={baseInformation.images || []}
                        startFromIndex={getMiddleIndex(baseInformation.images?.length || 0)}
                        height={isMinting ? 250 : 500}
                        changeImageAfterMs={5000}
                    />
                </div>
            )}

            <Title>{baseInformation.name}</Title>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12">
                <div>
                    { /* Section for external links (explorer, marketlace etc) */}
                    <div className="flex gap-4 mb-4">
                        {renderBlockchainExplorerLinks()}
                        {renderSecondaryMarketLinks()}
                    </div>

                    {baseInformation.loreAudio && (
                        <div className="mb-6">
                            <audio controls>
                                <source src={baseInformation.loreAudio} type="audio/mpeg" />
                            </audio>
                        </div>
                    )}
                    <div>{description}</div>
                </div>
                <div>
                    <Tabs activeTabId={selectedTab} onTabChange={handleTabChange} className="mb-6">
                        {artistsTabVisible && (
                            <Tab id="artists" header={artistsTabHeaderText}>
                                <ArtistsBio artists={baseInformation.artists as Artist[]} />
                            </Tab>
                        )}
                        <Tab id="roadmap" header="Roadmap">
                            <ImageWithPreview src={roadmapImageUrl} />
                        </Tab>
                        {attributionsTabVisible && (
                            <Tab id="attributions" header="Attributions">
                                <Attributions attributions={baseInformation.attributions as any} />
                            </Tab>
                        )}
                    </Tabs>
                </div>
            </div>
        </>
    )

}