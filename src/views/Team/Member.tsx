import styled from "styled-components";
import { SocialIcon } from "../../components/SocialIcon";

export type MemberProps = {
    name: string;
    image: string;
    twitterUrl: string;
}

const Background = styled.div`
    background: #0c6947;
    background: linear-gradient(146deg,#0c6947,#c7cccd);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#0c6947",endColorstr="#c7cccd",GradientType=1);
    transition: -webkit-transform .5s ease;
    transition: transform .5s ease;
    transition: transform .5s ease,-webkit-transform .5s ease;
    color: #000;
    border-radius: 2rem;
`;

const Title = styled.h2`
    font-weight: 600;
    font-size: 2rem;
    line-height: 2rem;
    text-align: center;
    padding: 20px 20px 10px;
`;

const LinksContainer = styled.div`
    text-align: center;
    padding: 5px;
`;

const Link = styled.a`
    display: inline-block
`;

export const Member: React.FC<MemberProps> = ({
    name,
    image,
    twitterUrl
}) => {
    const words = name.split(' ');

    return (
        <div>
            <Background>
                <Title>{words[0]}<br />{words[1]}</Title>
                <img className="w-100" src={image} />
            </Background>
            <LinksContainer className='my-2'>
                <Link href={twitterUrl} target="_blank">
                    <SocialIcon size={30} social='twitter' />
                </Link>
            </LinksContainer>
        </div>

    )

}