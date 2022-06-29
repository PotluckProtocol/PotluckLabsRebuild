import styled from "styled-components";
import { NetworkIcon } from "./NetworkIcon";

type ContainerProps = {
    iconCount: number;
    size: number;
}

const Container = styled.div<ContainerProps>`
    position: relative;
    height: ${props => props.size}px;
    width: ${props => props.size * props.iconCount}px;
`;

const PositionedNetworkIcon = styled<any>(NetworkIcon)`
    position: absolute;
    right: ${props => props.index * 15}px;
    top: 0;
`;

export type MultipleNetworkIconsProps = {
    className?: string;
    size?: number,
    networkIds: number[];
}

export const MultipleNetworkIcons: React.FC<MultipleNetworkIconsProps> = ({
    className,
    networkIds,
    size
}) => {
    return (
        <Container size={size || 35} iconCount={networkIds.length} className={className}>
            {networkIds.map((networkId, index) => (
                <PositionedNetworkIcon index={index} key={index} networkId={networkId} size={size} />
            ))}
        </Container>
    );
}