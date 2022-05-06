import classNames from "classnames";
import styled from "styled-components";
import { Network } from "../types/Networks";
import { weiToDisplayCost } from "../utils/wei-to-display-cost";
import { TextFit } from "./TextFit";

export type MintPriceProps = {
    className?: string;
    fontSizeRem: number,
    fitToHeight?: number,
    network: Network;
    weiPrice: number | string;
}

const Price = styled.span`
    margin-right: .35rem;
`;

export const MintPrice: React.FC<MintPriceProps> = ({
    className,
    fontSizeRem,
    fitToHeight,
    network,
    weiPrice
}) => {
    const decimals = network.symbol === 'AVAX' ? 1 : 0;
    const price = weiToDisplayCost(weiPrice, network, { decimals, excludeSymbol: true });

    const symbolFontSize = fontSizeRem - 0.5;
    const priceFontSize = fontSizeRem;

    const content = (
        <>
            <Price style={{ fontSize: `${priceFontSize}rem`, lineHeight: `${priceFontSize}rem` }}>{price}</Price>
            <span style={{ fontSize: `${symbolFontSize}rem`, lineHeight: `${symbolFontSize}rem` }}>{network.symbol}</span>
        </>
    )

    if (fitToHeight) {
        return (
            <TextFit className={className}>{content}</TextFit>
        );
    } else {
        const classes = classNames('flex', 'items-center', className);
        return (
            <div className={classes}>{content}</div>
        );
    }
}