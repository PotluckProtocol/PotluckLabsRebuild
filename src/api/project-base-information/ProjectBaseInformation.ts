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
    releaseDate: string;
    whitelistDate?: string;

    // For projects without contract
    internalId?: string;

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

    // Minting if any
    mint?: {
        priceErc20Token?: string;
        weiCost: string;
        whitelistWeiCost?: string;
        gasLimit: number;
        maxPerTx: number;
        mintImage: string;
        noWhitelist?: boolean;
        forceEndedState?: boolean;
        noReveal?: boolean;
    }

    externalMintLocation?: {
        name: string;
        url: string;
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