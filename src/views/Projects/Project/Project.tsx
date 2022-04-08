import { ReactNode, useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import styled from "styled-components";
import moment from 'moment';
import { Artist } from "../../../api/artists/Artist";
import { useIsMinting } from "../../../api/minting/useIsMinting";
import useProjectBaseInformation from "../../../api/project-base-information/useProjectBaseInformation";
import { ImageCarousel } from "../../../components/ImageCarousel";
import { ImageWithPreview } from "../../../components/ImageWithPreview";
import { Tab, Tabs } from "../../../components/Tabs"
import { MintProjectWrapper } from "../../Minting/MintProject/MintProjectWrapper";
import { ArtistsBio } from "./ArtistsBio";
import { Attributions } from "./Attributions";

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

const ComingSoonHeader = styled.p`
    font-size: 3rem;
    text-align: center;
    margin: 0 0 3rem;
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
        return Math.floor(count / 2) - 1
    }
}

export const Project: React.FC = () => {
    const { contractAddressOrNameIdent } = useParams<RouteParams>();
    const baseInformation = useProjectBaseInformation(contractAddressOrNameIdent || '');
    const artistsTabVisible = !!baseInformation.artists?.length;
    const [queryParams, setQueryParams] = useSearchParams();
    const [selectedTab, setSelectedTab] = useState('');
    const isMinting = useIsMinting(contractAddressOrNameIdent || '');

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

    if (isMinting === null) {
        return <div>Loading</div>
    }

    let comingSoonHeader: ReactNode;
    if (!isMinting && !baseInformation.contractAddress) {
        let timePart: ReactNode = <div>Public mint coming soon!</div>;
        if (baseInformation.releaseDate) {
            const m = moment(baseInformation.releaseDate)
            const strTime = `${m.utc().format('MMMM Do YYYY, h:mm A')} UTC`;
            timePart = (
                <div>
                    <div>Public mint on</div>
                    <div>{strTime}</div>
                </div>
            );
        }

        comingSoonHeader = (
            <ComingSoonHeader>
                {timePart}
            </ComingSoonHeader>
        );
    }

    return (
        <>
            {baseInformation.contractAddress && (
                <div className="mb-10">
                    <MintProjectWrapper
                        contractAddress={baseInformation.contractAddress}
                        embedded={true}
                    />
                </div>
            )}

            {comingSoonHeader}

            <div className="mb-10">
                <p className="text-center mb-2">Preview pieces from the collection</p>
                <ImageCarousel
                    images={baseInformation.images || []}
                    startFromIndex={getMiddleIndex(baseInformation.images?.length || 0)}
                    height={isMinting ? 250 : 500}
                    changeImageAfterMs={5000}
                />
            </div>

            <Title>{baseInformation.name}</Title>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12">
                <div>
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