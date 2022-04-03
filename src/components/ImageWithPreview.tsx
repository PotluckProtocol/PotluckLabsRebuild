import { useEffect, useState, CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { BiXCircle } from 'react-icons/bi';
import styled from "styled-components";
import { RoundedButton } from './RoundedButton';

export type ImageWithPreviewProps = React.ComponentPropsWithRef<'img'> & {
    wrapperClassName?: string;
    wrapperStyle?: CSSProperties;
}

const ButtonNoStyle = styled.button`
    background: none;
    border: none;
`;

const Shroud = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 100vh;
    z-index: 8999;
    background-color: rgba(0,0,0,0.75);
`;

const PositionedButton = styled(ButtonNoStyle)`
    position: absolute;
    right: 2rem;
    top: 2rem;
`;

const PreviewImage = styled.img`
    max-width: 90%;
    max-height: 75%;
    margin: 0 auto;
`;

const CenteredRoundedButton = styled(RoundedButton)`
    font-size: 1.2rem;
`;

export const ImageWithPreview: React.FC<ImageWithPreviewProps> = (props) => {

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const orig = document.body.style.overflow;
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.body.style.overflow = orig;
        }
    }, [isOpen]);

    const handleButtonClick = () => {
        setIsOpen(true);
    }

    const handleCloseButtonClick = () => {
        setIsOpen(false);
    }

    const {
        wrapperClassName,
        wrapperStyle,
        ...imageProps
    } = props;

    const a = (
        <>
            <Shroud className='flex justify-center items-center'>
                <PositionedButton onClick={handleCloseButtonClick}>
                    <BiXCircle size={40} color='white' />
                </PositionedButton>
                <div className='text-center'>
                    <PreviewImage src={imageProps.src} />
                    <CenteredRoundedButton className='mt-4' onClick={handleCloseButtonClick}>
                        Close preview
                    </CenteredRoundedButton>
                </div>
            </Shroud>
        </>
    )

    return (
        <>
            <ButtonNoStyle style={wrapperStyle} className={wrapperClassName} onClick={handleButtonClick}>
                <img {...imageProps} />
            </ButtonNoStyle>
            {isOpen && createPortal(a, document.body)}
        </>
    );

}