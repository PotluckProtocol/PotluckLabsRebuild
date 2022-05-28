import { useEffect, useState, CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { BiXCircle } from 'react-icons/bi';
import styled from "styled-components";
import { useTokenImageSrc } from '../hooks/useTokenImageSrc';
import { Loading } from './Loading';
import { RoundedButton } from './RoundedButton';

export type PreviewTokenImageProps = {
    networkId: number;
    contractAddress: string;
    tokenId: number;
    onClose: () => void;
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
    max-width: 90vw;
    max-height: 80vh;
    margin: 0 auto;
`;

const CenteredRoundedButton = styled(RoundedButton)`
    font-size: 1.2rem;
`;

export const PreviewTokenImage: React.FC<PreviewTokenImageProps> = ({
    contractAddress,
    tokenId,
    networkId,
    onClose
}) => {

    const [isLoadingSrc, imageSrc] = useTokenImageSrc({
        contractAddress,
        networkId,
        tokenId
    })

    useEffect(() => {
        const orig = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = orig;
        }
    }, []);

    const handleCloseButtonClick = () => {
        onClose();
    }

    const content = (
        <Shroud className='flex justify-center items-center'>
            <PositionedButton onClick={handleCloseButtonClick}>
                <BiXCircle size={40} color='white' />
            </PositionedButton>
            <div className='text-center'>
                {isLoadingSrc ? (
                    <div className='flex justify-center mb-8'>
                        <Loading width={175} size={15} />
                    </div>
                ) : (
                    <PreviewImage src={imageSrc || undefined} />
                )}

                <CenteredRoundedButton className='mt-4' onClick={onClose}>
                    Close preview
                </CenteredRoundedButton>
            </div>
        </Shroud>
    )

    return createPortal(content, document.body);
}