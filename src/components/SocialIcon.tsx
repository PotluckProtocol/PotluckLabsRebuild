import styled from "styled-components";
import { BsInstagram, BsTwitter } from 'react-icons/bs';

export type SocialIconProps = {
    className?: string;
    social: 'twitter' | 'instagram';
    size: number;
}


export const SocialIcon: React.FC<SocialIconProps> = ({
    className,
    size,
    social
}) => {

    const iconProps = {
        className,
        size,
        color: 'white'
    }

    return (
        <>
            {social === 'instagram' && (<BsInstagram {...iconProps} />)}
            {social === 'twitter' && (<BsTwitter {...iconProps} />)}
        </>
    )
}