import { NumericLiteral } from "typescript";

export type ProjectBaseInformation = {
    name: string;
    symbol: string;
    contractAddress: string;
    coverImage: string;
    network: 'Fantom' | 'Avalanche' | 'Polygon';
    maxSupply: number;
    hideInProjects?: boolean;
    overrideIpfsGateway?: string;
    mint?: {
        weiCost: number;
        gasLimit: number;
        maxPerTx: number;
        mintImage: string;
        noWhitelist?: boolean;
        forceEndedState?: boolean;
    }
    mutate?: {
        targetContractAddress: string;
        approveGasLimit: number;
        mutetaGasLimit: number;
        serumUnitNotation?: string;
    }
}