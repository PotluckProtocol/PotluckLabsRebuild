import { ComponentPropsWithRef } from "react";
import styled from "styled-components";

export type ProgressBarProps = {
    min: number;
    max: number;
    value: number;
    height: number;
}

type BarProps = ComponentPropsWithRef<'div'> & {
    percentageWidth: string
    height: number;
}

const Bar = styled.div<BarProps>`
    background-color: #1bf2a4;
    height: 100%;
    width: ${props => props.percentageWidth};
    height: ${props => props.height};
`;

export const ProgressBar: React.FC<ProgressBarProps> = ({
    min,
    max,
    value,
    height
}) => {
    const percentage = ((value === 0) ? value : (value / (max - min) * 100)).toFixed(2) + '%';
    return (
        <div className="flex rounded-sm" role="progressbar" style={{ display: 'block', 'height': height, backgroundColor: '#0c6947' }}>
            <Bar className="rounded-sm" height={height} percentageWidth={percentage} />
        </div>
    )
}