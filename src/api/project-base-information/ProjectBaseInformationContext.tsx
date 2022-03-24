import { createContext, useEffect, useState } from "react";
import { ProjectBaseInformation } from "./ProjectBaseInformation";

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
            const res = await fetch('/config/project-base-information.json');
            const info = await res.json();
            setBaseInformation(info);
            setIsInitialized(true);
        }

        getConfig();
    }, []);

    const getConfig = (contractAddress: string): ProjectBaseInformation => {
        const item = baseInformation.find(item => item.contractAddress === contractAddress);
        if (!item) {
            console.log('was');
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