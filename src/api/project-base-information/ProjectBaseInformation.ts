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

export type ProjectBaseInformationRaw = {
    // Base info
    name: string;
    symbol: string;
    contractAddress: string;
    coverImage: string;
    network: 'FTM' | 'AVAX' | 'MATIC';
    maxSupply: number;
    releaseDate?: string;

    // Specific information
    artistId?: string | string[];
    description?: string | string[];
    roadmapImage?: string;
    loreAudio?: string;
    attributions?: Array<{ name: string, link: string }>;

    // Settings like
    hideInProjects?: boolean;
    overrideIpfsGateway?: string;

    // Minting if any
    mint?: {
        weiCost: number;
        gasLimit: number;
        maxPerTx: number;
        mintImage: string;
        noWhitelist?: boolean;
        forceEndedState?: boolean;
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