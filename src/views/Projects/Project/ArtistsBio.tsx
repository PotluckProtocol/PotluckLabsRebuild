import styled from "styled-components";
import { Artist } from "../../../api/artists/Artist"
import { SocialIcon, SocialIconProps } from "../../../components/SocialIcon";

export type ArtistsBioProps = {
    artists: Artist[];
}

const ArtistName = styled.h2`
    font-size: 1.1rem;
    font-weight: 700;
`;

const Description = styled.p`
    color: #bdd0c9;
`;

const StyledSocialIcon = styled(SocialIcon)`
    margin-right: 1rem;
    display: inline-block;
`;

const createSocialItem = (social: SocialIconProps['social'], url: string) => (
    <a href={url} target="_blank">
        <StyledSocialIcon social={social} size={30} />
    </a>
)

export const ArtistsBio: React.FC<ArtistsBioProps> = ({
    artists
}) => {
    return (
        <div>
            {artists.map(artist => {
                return (
                    <div key={artist.id}>
                        <ArtistName>{artist.name}</ArtistName>
                        {artist.description && (<Description>{artist.description}</Description>)}
                        <div>
                            {artist.social?.twitter && createSocialItem('twitter', artist.social.twitter)}
                            {artist.social?.instagram && createSocialItem('twitter', artist.social.instagram)}
                        </div>
                    </div>
                );
            })}
        </div>
    )
}