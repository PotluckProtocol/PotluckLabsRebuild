import { Token } from "../types/Token";

export const weiToNumber = (weiCost: number | string, token: Token): number => {
    const costStr = weiCost.toString();
    const fullPart = costStr.substring(0, costStr.length - token.decimals);
    const decimalPart = costStr.substring(costStr.length - token.decimals);

    return parseFloat(`${fullPart}.${decimalPart}`);
}

export type WeiToDisplayCostOpts = {
    decimals?: number;
    excludeSymbol?: boolean;
    includeDollarSymbol?: boolean;
}

export const weiToDisplayCost = (weiCost: number | string, token: Token, opts: WeiToDisplayCostOpts = {}) => {
    const numericCost = weiToNumber(weiCost, token);
    const decimalCount = (typeof opts.decimals === 'number') ? opts.decimals : 2;

    const parts = [
        numericCost.toFixed(decimalCount)
    ];

    if (!opts.excludeSymbol) {
        let symbol = token.symbol.toLocaleUpperCase();
        if (opts.includeDollarSymbol) {
            symbol = '$' + symbol;
        }
        parts.push(symbol);
    }

    return parts.join(' ');
}