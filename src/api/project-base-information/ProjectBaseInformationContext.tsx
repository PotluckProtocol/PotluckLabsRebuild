import { createContext, useEffect, useState } from "react";
import { Network } from "../../types/Networks";
import { Artist } from "../artists/Artist";
import { resolveNetwork } from "../network/resolveNetwork";
import { ProjectBaseInformation, ProjectBaseInformationRaw } from "./ProjectBaseInformation";

export const createConfigNameIdent = (name: string, network: Network): string => {
    return `${network.symbol.toLocaleLowerCase()}-${name.replaceAll(' ', '-')}`;
}

export const resolveIdentInfo = (baseInformation: ProjectBaseInformation): string => {
    if (baseInformation.contractAddress) {
        return baseInformation.contractAddress;
    } else {
        return createConfigNameIdent(baseInformation.name, resolveNetwork(baseInformation.network));
    }
}

export const isContract = (contractAddressOrNameIdent: string): boolean => contractAddressOrNameIdent.startsWith('0x');

export const isInternalId = (contractAddressOrNameIdent: string): boolean => contractAddressOrNameIdent.startsWith('internal::');

export type ProjectBaseInformationContextType = {
    isInitialized: boolean;
    getConfig(contractAddressOrNameIdent: string): ProjectBaseInformation;
    getConfigs(): ProjectBaseInformation[];
}

export const ProjectBaseInformationContext = createContext<ProjectBaseInformationContextType>(null as any);

export const ProjectBaseInformationProvider: React.FC = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [baseInformation, setBaseInformation] = useState<ProjectBaseInformation[]>([]);

    useEffect(() => {
        const getConfig = async () => {
            const [configRes, artistsRes] = await Promise.all([
                fetch('/config/project-base-information.json'),
                fetch('/config/artists.json')
            ]);

            const allArtists = await artistsRes.json() as Artist[];
            const configs = await configRes.json() as ProjectBaseInformationRaw[];

            const populatedConfigs: ProjectBaseInformation[] = configs.map(item => {
                const { artistId, ...rest } = item;

                let artists: Artist[] | undefined;
                if (artistId && artistId.length > 0) {
                    const artistIdArr = Array.isArray(artistId) ? artistId : [artistId];
                    artists = artistIdArr
                        .map(id => allArtists.find(artist => artist.id === id))
                        .filter(Boolean) as Artist[]
                }

                return {
                    ...rest,
                    artists
                }
            });


            setBaseInformation(populatedConfigs);
            setIsInitialized(true);
        }

        getConfig();
    }, []);

    const getConfig = (contractAddressOrIdentName: string): ProjectBaseInformation => {
        const item = baseInformation.find(item => {
            if (isContract(contractAddressOrIdentName)) {
                return item.contractAddress === contractAddressOrIdentName
            } else if (isInternalId(contractAddressOrIdentName)) {
                return item.internalId === contractAddressOrIdentName
            } else {
                return createConfigNameIdent(item.name, resolveNetwork(item.network)) === contractAddressOrIdentName;
            }
        });
        if (!item) {
            throw new Error(`Could not find base information for ${contractAddressOrIdentName}`);
        }
        return item;
    }

    const getConfigs = (): ProjectBaseInformation[] => {
        return baseInformation;
    }

    const contextValue: ProjectBaseInformationContextType = {
        isInitialized,
        getConfigs,
        getConfig
    }

    return (
        <ProjectBaseInformationContext.Provider value={contextValue} >
            {children}
        </ProjectBaseInformationContext.Provider>
    );

}