import { createContext, useEffect, useState } from "react";
import { Store } from "./Store";

export type StoresContextType = {
    isInitialized: boolean;
    configs: Store[];
}

export const StoresContext = createContext<StoresContextType>(null as any);

export const StoresProvider: React.FC = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [storeConfigs, setStoreConfigs] = useState<Store[]>([]);

    useEffect(() => {
        const getConfigs = async () => {
            const res = await fetch('/config/stores.json')
            const configs = await res.json() as any[];

            // Replace string dates with Date objects
            const hydratedConfigs = configs.map(config => ({
                ...config,
                saleEndsOn: new Date(config.saleEndsOn)
            }));

            setStoreConfigs(hydratedConfigs);
            setIsInitialized(true);
        }

        getConfigs();
    }, []);

    const contextValue: StoresContextType = {
        isInitialized,
        configs: storeConfigs
    }

    return (
        <StoresContext.Provider value={contextValue} >
            {children}
        </StoresContext.Provider>
    );

}