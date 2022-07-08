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
    usdPricePerUnit?: number;
}

const Price = styled.span`
    margin-right: .35rem;
`;

const USD = styled.span`
    color: white; 
    margin-left: .35rem;
`;

export const MintPrice: React.FC<MintPriceProps> = ({
    className,
    fontSizeRem,
    fitToHeight,
    symbol,
    weiPrice,
    usdPricePerUnit
}) => {
    const decimals = symbol === 'AVAX' ? 2 : 0;
    const priceNumeric = +utils.formatEther(BigNumber.from(weiPrice));
    const price = priceNumeric.toFixed(decimals);
    const usdPrice = (typeof usdPricePerUnit === 'number') ? (usdPricePerUnit * priceNumeric) : undefined;

    const symbolFontSize = fontSizeRem - 0.5;
    const priceFontSize = fontSizeRem;

    const content = (
        <>
            <Price style={{ fontSize: `${priceFontSize}rem`, lineHeight: `${priceFontSize}rem` }}>{price}</Price>
            <span style={{ fontSize: `${symbolFontSize}rem`, lineHeight: `${symbolFontSize}rem` }}>{symbol}</span>
            {typeof usdPrice === 'number' && (
                <USD>(${usdPrice.toFixed(2)})</USD>
            )}
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