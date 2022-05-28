import { createContext, useEffect, useState } from "react";
import { Network } from "../../types/Networks";
import { resolveNetwork } from "../network/resolveNetwork";
import { Traversing } from "./Traversing";


export type TraversingInfoContextType = {
    isInitialized: boolean;
    getTraversingInfo(projectContractAddress: string): Traversing | null;
    getTraversingInfos(): Traversing[];
}

export const TraversingInfoContext = createContext<TraversingInfoContextType>(null as any);

export const TraversingInfoProvider: React.FC = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [traversingInfos, setTraversingInfos] = useState<Traversing[]>([]);

    useEffect(() => {
        const fetchConfigs = async () => {
            const config = await fetch('/config/traversing.json');

            const configs = await config.json() as Traversing[];

            const populatedConfigs: Traversing[] = configs.map(item => {
                let { chains, ...rest } = item;

                chains = chains.map(chain => ({
                    ...chain,
                    network: resolveNetwork(chain.network as unknown as string)
                }));

                return {
                    ...rest,
                    chains
                }
            });


            setTraversingInfos(populatedConfigs);
            console.log('init');
            setIsInitialized(true);
        }

        fetchConfigs();
    }, []);

    const getTraversingInfo = (id: string): Traversing | null => {
        return traversingInfos.find(item => item.id === id) || null;
    }

    const getTraversingInfos = (): Traversing[] => {
        return [...traversingInfos]
    }

    const contextValue: TraversingInfoContextType = {
        isInitialized,
        getTraversingInfo,
        getTraversingInfos
    }

    return (
        <TraversingInfoContext.Provider value={contextValue} >
            {children}
        </TraversingInfoContext.Provider>
    );

}