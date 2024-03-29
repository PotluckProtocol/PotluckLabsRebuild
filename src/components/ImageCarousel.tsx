import classNames from "classnames";
import { ComponentPropsWithoutRef, useEffect, useRef, useState } from "react";
import { BiChevronsLeft, BiChevronsRight } from "react-icons/bi";
import styled, { CSSProperties } from "styled-components";
import { useImageWidth } from "../hooks/useImageWidth";
import useInterval from "../hooks/useInterval";
import { useLoadMultipleImagesBackground } from "../hooks/useLoadMultipleImagesBackground";
import { Loading } from "./Loading";

const IMAGE_PADDING_PX = 16;

export type ImageCarouselProps = {
    images: string[];
    height: number;
    changeImageAfterMs?: number;
    startFromIndex?: number;
    nonActiveImageOpacity?: string;
}

const LookupWindow = styled.div`
    overflow-x: hidden;
    width: 100%;
    position: relative;
`;

const NavContainer = styled.div`
    width: 50px;
    z-index: 10;
`;

const ImageContainer = styled.div`
    white-space: nowrap;
    transition: transform 500ms ease-in-out;
`;

const NoStyleButton = styled.button`
    border: none;
    background: none;
`;

type BallProps = {
    active: boolean;
}

const Ball = styled.span<BallProps>`
    display: inline-block;
    background-color: ${props => props.active ? '#1bf2a4' : '#e5e5e5'};
    border-radius: 50%;
    width: .9rem;
    height: .9rem;
    margin: 0 .5rem;

    &:hover {
        background-color: #0c6947;
    }
`;

type ImageProps = ComponentPropsWithoutRef<'image'> & {
    active: boolean;
    nonActiveOpacity: string;
}

const Image = styled.img<ImageProps>`
    max-height: 100%;
    border-radius: 2rem;
    display: inline-block;
    padding: 0 ${IMAGE_PADDING_PX}px;
    opacity: ${props => props.active ? '1' : props.nonActiveOpacity};
    transition: opacity 500ms ease-in-out;
`;

export const ImageCarousel: React.FC<ImageCarouselProps> = (props) => {
    const [middleImageIndex, setMiddleImageIndex] = useState(typeof props.startFromIndex === 'number' ? props.startFromIndex : 0);
    const [containerWidth, setContainerWidth] = useState<number | null>(null);
    const containerRef = useRef(null);
    const images = useLoadMultipleImagesBackground(props.images);
    const imageWidth = useImageWidth(images?.[0] || null, props.height);

    const intervalMs = props.changeImageAfterMs || null;

    const callback = () => {
        if (images === null) {
            return;
        }

        const nextIndex = middleImageIndex + 1;
        if (nextIndex < images.length) {
            setMiddleImageIndex(nextIndex);
        } else {
            setMiddleImageIndex(0);
        }
    }

    const resetInterval = useInterval(callback, containerRef.current ? intervalMs : null);

    const resizeHandler = () => {
        resolveContainerWidth();
    }

    useEffect(() => {
        window.addEventListener('resize', resizeHandler);
        return () => window.removeEventListener('resize', resizeHandler);
    }, []);

    const resolveContainerWidth = () => {
        if (containerRef.current) {
            const innerWidth = (containerRef.current as any).clientWidth;
            setContainerWidth(innerWidth);
        }
    }

    useEffect(() => {
        resolveContainerWidth();
    }, [containerRef.current, images, imageWidth]);


    if (images === null || imageWidth === null) {
        const loadingHeight = Math.min(props.height - 20, 120);
        return (
            <div className="text-center flex items-center justify-center" style={{ height: props.height }}>
                <Loading width={loadingHeight} />
            </div>
        );
    }

    const handleNext = () => {
        setMiddleImageIndex(middleImageIndex + 1);
        resetInterval();
    }

    const handlePrev = () => {
        setMiddleImageIndex(middleImageIndex - 1);
        resetInterval();
    }

    const styleObject: CSSProperties = {
        height: props.height
    }

    if (containerWidth !== null) {
        const imageWidthWithPaddings = imageWidth + (2 * IMAGE_PADDING_PX);
        const maxImageWidth = Math.min(containerWidth, imageWidthWithPaddings);
        const translateX = (containerWidth / 2) - (maxImageWidth / 2) - (maxImageWidth * middleImageIndex)
        styleObject.transform = `translateX(${translateX}px)`;
    }

    const opacity = (props.nonActiveImageOpacity) ? props.nonActiveImageOpacity : '.2';

    return (
        <div>
            <LookupWindow>
                <NavContainer className="absolute left-0 top-0 bottom-0 flex items-center justify-center">
                    {middleImageIndex > 0 && (
                        <NoStyleButton onClick={handlePrev}>
                            <BiChevronsLeft size={40} color='#1bf2a4' />
                        </NoStyleButton>
                    )}
                </NavContainer>
                <ImageContainer ref={containerRef} style={styleObject}>
                    {containerWidth && images.map((image, index) => (
                        <Image
                            key={index}
                            nonActiveOpacity={opacity}
                            active={index === middleImageIndex}
                            src={image}
                        />
                    ))}
                </ImageContainer>
                <NavContainer className="absolute right-0 top-0 bottom-0 flex items-center justify-center">
                    {middleImageIndex < images.length - 1 && (
                        <NoStyleButton onClick={handleNext}>
                            <BiChevronsRight size={40} color='#1bf2a4' />
                        </NoStyleButton>
                    )}
                </NavContainer>
            </LookupWindow>

            <div className="mt-4 flex justify-center items-center">
                {images.map((_, index) => (
                    <NoStyleButton key={index} onClick={() => setMiddleImageIndex(index)}>
                        <Ball active={index === middleImageIndex} />
                    </NoStyleButton>
                ))}
            </div>

        </div >
    );

} 