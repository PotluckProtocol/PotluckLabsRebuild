import { createContext, useEffect, useState } from "react";
import { Artist } from "../artists/Artist";
import { ProjectBaseInformation, ProjectBaseInformationRaw } from "./ProjectBaseInformation";

export type ProjectBaseInformationContextType = {
    isInitialized: boolean;
    getConfig(contractAddress: string): ProjectBaseInformation;
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

    const getConfig = (contractAddress: string): ProjectBaseInformation => {
        const item = baseInformation.find(item => item.contractAddress === contractAddress);
        if (!item) {
            throw new Error(`Could not find base information for ${contractAddress}`);
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