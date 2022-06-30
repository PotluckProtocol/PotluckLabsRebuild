import moment from "moment";
import styled from "styled-components";
import { ExternalMintOptions } from "../../../api/project-base-information/ProjectBaseInformation"

export type ExternalMintProps = {
    releaseDate: Date;
    externalMint: ExternalMintOptions;
}

const Container = styled.div`
    position: relative;
    height: 250px;
`;

type BgProps = {
    image?: string;
}

const Bg = styled.div<BgProps>`
    position: absolute;
    opacity: .075;
    bottom: 15px;
    top: 15px;
    right: 0;
    left: 0;
    background-image: ${props => props.image ? `url(${props.image})` : 'none'};
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center center;
`;

const ExternalLink = styled.a`
    color: #00f69d;
    text-decoration: underline;
`;

const Text = styled.div`
    text-align: center;
    font-size: 2rem;
`;

export const ExternalMint: React.FC<ExternalMintProps> = ({
    externalMint,
    releaseDate
}) => {
    const m = moment(releaseDate);
    return (
        <Container>
            <Bg image={externalMint.image} />
            <Text>
                <div>Public mint on</div>
                <div>{`${m.utc().format('MMMM Do YYYY, h:mm A')} UTC`}</div>
                <div className="mt-2">On <ExternalLink href={externalMint.url}>{externalMint.name}</ExternalLink></div>
            </Text>
        </Container>
    )
}