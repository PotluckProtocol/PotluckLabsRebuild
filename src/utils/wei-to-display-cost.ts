import { Network } from "../types/Networks";

export type WeiToDisplayCostOpts = {
    decimals?: number;
    excludeSymbol?: boolean;
}

export const weiToDisplayCost = (weiCost: number, network: Network, opts: WeiToDisplayCostOpts = {}) => {
    const costStr = weiCost.toString();
    const fullPart = costStr.substring(0, costStr.length - network.decimals);
    const decimalPart = costStr.substring(costStr.length - network.decimals);
    const decimalCount = (typeof opts.decimals === 'number') ? opts.decimals : 2;

    const parts = [
        parseFloat(`${fullPart}.${decimalPart}`).toFixed(decimalCount)
    ];

    if (!opts.excludeSymbol) {
        parts.push(network.symbol.toLocaleUpperCase());
    }

    return parts.join(' ');
}