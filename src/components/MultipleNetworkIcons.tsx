import styled from "styled-components";
import { NetworkIcon } from "./NetworkIcon";

const Container = styled.div`
    position: relative;
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
        <Container className={className}>
            {networkIds.map((networkId, index) => (
                <NetworkIcon key={index} networkId={networkId} size={size} />
            ))}
        </Container>
    );
}