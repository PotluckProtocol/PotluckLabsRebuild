import classNames from "classnames";
import { BigNumber, utils } from "ethers";
import styled from "styled-components";
import { TextFit } from "./TextFit";

export type MintPriceProps = {
    className?: string;
    fontSizeRem: number,
    fitToHeight?: number,
    symbol: string;
    weiPrice: number | string;
}

const Price = styled.span`
    margin-right: .35rem;
`;

export const MintPrice: React.FC<MintPriceProps> = ({
    className,
    fontSizeRem,
    fitToHeight,
    symbol,
    weiPrice
}) => {
    const decimals = symbol === 'AVAX' ? 1 : 0;
    const price = (+utils.formatEther(BigNumber.from(weiPrice))).toFixed(decimals);

    const symbolFontSize = fontSizeRem - 0.5;
    const priceFontSize = fontSizeRem;

    const content = (
        <>
            <Price style={{ fontSize: `${priceFontSize}rem`, lineHeight: `${priceFontSize}rem` }}>{price}</Price>
            <span style={{ fontSize: `${symbolFontSize}rem`, lineHeight: `${symbolFontSize}rem` }}>{symbol}</span>
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