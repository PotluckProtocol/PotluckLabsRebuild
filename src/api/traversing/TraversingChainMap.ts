import { resolveNetwork } from "../network/resolveNetwork";

export type TraversingChainInfo = {
    network: string;
    traverseChainId: number;
    endpoint: string;
}

export const TRAVERSING_CHAIN_MAP: TraversingChainInfo[] = [{
    network: 'FTM',
    traverseChainId: 12,
    endpoint: '0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7'
}, {
    network: 'AVAX',
    traverseChainId: 6,
    endpoint: '0x3c2269811836af69497E5F486A85D7316753cf62'
}]

export const getTraversingChainInfo = (networkId: number): TraversingChainInfo | null => {
    return TRAVERSING_CHAIN_MAP.find(item => resolveNetwork(item.network).networkId === networkId) || null;
}