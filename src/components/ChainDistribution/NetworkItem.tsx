import styled from "styled-components";
import { NetworkIcon } from "../NetworkIcon";

export type NetworkItemProps = {
    percentage: number;
    networkId?: number;
    text?: string;
    color: string;
    height: number;
}

export type ContainerProps = {
    backgroundColor: string;
    percentageWidth: number;
    height: number;
}

const Container = styled.div<ContainerProps>`
    float: left;
    background-color: ${props => props.backgroundColor};
    width: ${props => props.percentageWidth.toFixed(2)}%;
    height: ${props => props.height}px;
    overflow:hidden;
    transition: all ease-in-out 200ms;
`;

export type BlockProps = {
    backgroundColor: string;
    height: number;
}

type TextProps = {
    lineHeight: number;
}

const Text = styled.div<TextProps>`
    color: black;
    font-size: .75rem;
    text-align: center;
    line-height: ${props => props.lineHeight}px;
    height: ${props => props.lineHeight}px;
`;

export const NetworkItem: React.FC<NetworkItemProps> = ({
    networkId,
    text,
    color,
    percentage,
    height
}) => {

    const renderBlockContent = () => {
        if (!!networkId) {
            return (
                <NetworkIcon className="inline-block" networkId={networkId} size={height} />
            );
        } else if (text) {
            return (
                <Text lineHeight={height}>{text}</Text>
            );
        }
    }

    return (
        <Container className="text-center" percentageWidth={percentage} height={height} backgroundColor={color}>
            {renderBlockContent()}
        </Container>
    );

}