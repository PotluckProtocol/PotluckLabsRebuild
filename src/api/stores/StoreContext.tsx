import { ethers } from "ethers";
import { createContext, useContext, useState } from "react";
import useUser from "../account/useUser";
import { resolveNetwork } from "../network/resolveNetwork";
import { ProjectBaseInformationContext } from "../project-base-information/ProjectBaseInformationContext";
import { abi } from "./abi";
import { ERC20TokenWrapper } from "./ERC20TokenWrapper";
import { Store } from "./Store";

export type StoreContextType = {
    init(store: Store): Promise<void>;
    buy(): Promise<void>;
    isInitialized: boolean;
}

export const StoreContext = createContext<StoreContextType>(null as any);

export const StoreProvider: React.FC = ({ children }) => {

    const [isInitialized, setIsInitialized] = useState(false);
    const [wrapper, setWrapper] = useState<ERC20TokenWrapper>();
    const [storeConfig, setStoreConfig] = useState<Store>();
    const projectBaseInfoContext = useContext(ProjectBaseInformationContext);
    const user = useUser();

    const init = async (storeConfig: Store) => {
        console.log('Init store', storeConfig.projectContractAddressOrName);

        const baseInformation = projectBaseInfoContext.getSingletonConfig(storeConfig.projectContractAddressOrName);

        const priceErc20TokenContract = new ethers.Contract(
            storeConfig.priceTokenContractAddress,
            abi,
            user.getSignerOrProvider(
                resolveNetwork(baseInformation.chain).networkId
            )
        )
        const wrapper = new ERC20TokenWrapper(priceErc20TokenContract);

        setStoreConfig(storeConfig);
        setWrapper(wrapper);
        setIsInitialized(true);
    }

    const buy = async () => {
        if (!isInitialized || !wrapper || !storeConfig || !user.account) {
            return;
        }

        await wrapper.transfer(
            storeConfig.targetWalletAddress,
            storeConfig.priceWei
        );
    }

    const contextValue: StoreContextType = {
        init,
        buy,
        isInitialized
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
}