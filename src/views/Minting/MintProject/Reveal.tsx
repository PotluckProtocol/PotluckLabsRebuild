import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BiXCircle } from "react-icons/bi";
import styled from "styled-components";
import { MintingContext } from "../../../api/minting/MintingContext";
import { ImageCarousel } from "../../../components/ImageCarousel";
import { RoundedButton } from "../../../components/RoundedButton";
import useScreenSize from "../../../hooks/useScreenSize";

export type RevealProps = {
    className?: string;
    tokenIds: number[];
    shadowImage: string;
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
    z-index: 8998;
    background-color: #000;
`;

const PositionedButton = styled(ButtonNoStyle)`
    position: absolute;
    right: 2rem;
    top: 2rem;
`;

const CenteredRoundedButton = styled(RoundedButton)`
    font-size: 1.2rem;
`;

const RevealButton = styled(RoundedButton)`
    font-size: 1.2rem;
`;

export const Reveal: React.FC<RevealProps> = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [keyCounter, setKeyCounter] = useState(0);
    const [latestSeenIndex, setLatestSeenIndex] = useState(0);
    const [loadedImageUrls, setLoadedImageUrls] = useState<string[]>([]);
    const [loadedTokenIds, setLoadedTokenIds] = useState<number[]>([]);
    const mintingContext = useContext(MintingContext);
    const screenSize = useScreenSize();

    useEffect(() => {
        const orig = document.body.style.overflow;
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.body.style.overflow = orig;
        }
    }, [isOpen]);

    useEffect(() => {
        const fetchImages = async () => {
            if (mintingContext.isInitialized) {
                const notPreviouslyLoadedTokenIds = props.tokenIds.filter(id => !loadedTokenIds.includes(id));
                const newImageUrls = await mintingContext.fetchImageUrls(notPreviouslyLoadedTokenIds);

                setLoadedImageUrls([...loadedImageUrls, ...newImageUrls]);
                setLoadedTokenIds([...loadedTokenIds, ...notPreviouslyLoadedTokenIds]);
                // For forcing rerenders
                setKeyCounter(keyCounter + 1);
            }
        }

        fetchImages();
    }, [props.tokenIds, mintingContext.isInitialized]);

    const handleClose = () => {
        setIsOpen(false);
        setLatestSeenIndex(loadedImageUrls.length);
    }

    const handleClickRevealButton = () => {
        setIsOpen(true);
    }

    const a = (
        <div key={keyCounter}>
            <Shroud className='flex justify-center items-center'>
                <PositionedButton onClick={handleClose}>
                    <BiXCircle size={40} color='white' />
                </PositionedButton>
                <div style={{ maxWidth: 1300 }} className='text-center mx-auto'>
                    <ImageCarousel
                        key={keyCounter}
                        images={loadedImageUrls}
                        startFromIndex={Math.min(latestSeenIndex, loadedImageUrls.length - 1)}
                        height={screenSize === 'xs' ? 400 : 600}
                        changeImageAfterMs={10000}
                        nonActiveImageOpacity='.05'
                    />
                    <CenteredRoundedButton className='mt-8' onClick={handleClose}>
                        Close reveal
                    </CenteredRoundedButton>
                </div>
            </Shroud>
        </div>
    )

    return (
        <>
            <RevealButton disabled={mintingContext.isMintInProgress} onClick={handleClickRevealButton}>
                REVEAL <b>{props.tokenIds.length}</b> {props.tokenIds.length === 1 ? 'piece' : 'pieces'}!
            </RevealButton>
            {isOpen && createPortal(a, document.body)}
        </>
    )
}
