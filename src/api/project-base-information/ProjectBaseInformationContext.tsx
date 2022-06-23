import { createContext, useEffect, useState } from "react";
import { Artist } from "../artists/Artist";
import { getSingletonProjectBaseInformation } from "./getSingletonProjectBaseInformation";
import { ProjectBaseInformation, ProjectBaseInformationRaw, ProjectChain, SingletonProjectBaseInformation } from "./ProjectBaseInformation";

export const isContract = (contractAddressOrNameIdent: string): boolean => contractAddressOrNameIdent.startsWith('0x');

export const isInternalId = (contractAddressOrNameIdent: string): boolean => contractAddressOrNameIdent.startsWith('internal::');

export type ProjectBaseInformationContextType = {
    isInitialized: boolean;
    getConfig(contractAddressOrNameIdent: string): ProjectBaseInformation;
    getConfigs(): ProjectBaseInformation[];
    getSingletonConfig(contractAddress: string): SingletonProjectBaseInformation;
    getSingletonConfigs(): SingletonProjectBaseInformation[];
}

export const ProjectBaseInformationContext = createContext<ProjectBaseInformationContextType>(null as any);

export const ProjectBaseInformationProvider: React.FC = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [baseInformation, setBaseInformation] = useState<ProjectBaseInformation[]>([]);

    useEffect(() => {
        const getConfig = async () => {
            const [configRes, artistsRes] = await Promise.all([
                fetch('/config/project-base-information-v2.json'),
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

    const getConfig = (contractAddressOrId: string): ProjectBaseInformation => {
        const item = baseInformation.find(item => {
            if (isContract(contractAddressOrId)) {
                return Object.values(item.chains).map(chain => chain.contractAddress).includes(contractAddressOrId);
            } else {
                return item.id === contractAddressOrId;
            }
        });
        if (!item) {
            throw new Error(`Could not find base information for ${contractAddressOrId}`);
        }
        return item;
    }

    const getConfigs = (): ProjectBaseInformation[] => {
        return baseInformation;
    }

    const getSingletonConfig = (contractAddress: string): SingletonProjectBaseInformation => {
        for (const baseInfo of baseInformation) {
            for (const chain of Object.keys(baseInfo.chains)) {
                const projectChain = chain as ProjectChain;
                const chainInfo = baseInfo.chains[projectChain];
                if (chainInfo?.contractAddress === contractAddress) {
                    return getSingletonProjectBaseInformation(baseInfo, projectChain)
                }
            }
        }

        throw new Error(`Could not find singleton base information for ${contractAddress}`);
    }

    const getSingletonConfigs = (): SingletonProjectBaseInformation[] => {
        return baseInformation.flatMap(baseInfo => {
            return Object.keys(baseInfo.chains).map(
                chain => getSingletonProjectBaseInformation(baseInfo, chain as ProjectChain)
            );
        })
    }

    const contextValue: ProjectBaseInformationContextType = {
        isInitialized,
        getConfigs,
        getConfig,
        getSingletonConfig,
        getSingletonConfigs
    }

    return (
        <ProjectBaseInformationContext.Provider value={contextValue} >
            {children}
        </ProjectBaseInformationContext.Provider>
    );

}