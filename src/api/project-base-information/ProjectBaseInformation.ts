import { Artist } from "../artists/Artist";

export type ProjectArtist = {
    name: string;
    description?: string | string[];
    image?: string;
    social: {
        twitter?: string;
        instagram?: string;
    }
}

export type ProjectChain = 'FTM' | 'AVAX' | 'MATIC';

export type MintOptions = {
    priceErc20Token?: string;
    weiCost: string;
    gasLimit: number;
    maxPerTx: number;
    mintImage: string;
    noWhitelist?: boolean;
    forceEndedState?: boolean;
    noReveal?: boolean;
}

export type ExternalMintOptions = {
    name: string;
    url: string;
}

export type ChainProjectInformation = {
    contractAddress: string;
    initialSupply: number;
    mint?: MintOptions;
    externalMintLocation?: ExternalMintOptions;
}

export type ProjectBaseInformationRaw = {
    // Base info
    id: string;
    name: string;
    symbol: string;
    coverImage: string;
    releaseDate: string;
    whitelistDate?: string;

    chains: Partial<Record<ProjectChain, ChainProjectInformation>>;

    // Specific information
    artistId?: string | string[];
    description?: string | string[];
    roadmapImage?: string;
    images?: string[];
    loreAudio?: string;
    attributions?: Array<{ name: string, url: string }>;

    // Settings like
    hideInProjects?: boolean;
    overrideIpfsGateway?: string;

    secondaryMarketplace?: {
        NFTKey?: {
            collectionUrlPart?: string;
        }
    }

    // Mutate if any
    mutate?: {
        targetContractAddress: string;
        approveGasLimit: number;
        mutetaGasLimit: number;
        serumUnitNotation?: string;
    }
}

export type ProjectBaseInformation = Omit<ProjectBaseInformationRaw, 'artistId'> & {
    artists?: Artist[];
}

export type SingletonProjectBaseInformation = (
    Omit<ProjectBaseInformation, 'chains'> & {
        chain: ProjectChain;
        contractAddress: string;
        initialSupply: number;
        mint?: MintOptions;
        externalMintLocation?: ExternalMintOptions;
    }
);