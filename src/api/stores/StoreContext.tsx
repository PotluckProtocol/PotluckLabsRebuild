import { createContext, useContext, useState } from "react";
import Web3 from "web3";
import useAccount from "../account/useAccount";
import { resolveNetwork } from "../network/resolveNetwork";
import { ProjectBaseInformationContext } from "../project-base-information/ProjectBaseInformationContext";
import { Web3Context } from "../web3/Web3Context";
import { abi } from "./abi";
import { ERC20TokenWrapper } from "./ERC20TokenWrapper";
import { sendTransaction } from "./sendTransaction";
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
    const [web3, setWeb3] = useState<Web3>();
    const [storeConfig, setStoreConfig] = useState<Store>();
    const web3Context = useContext(Web3Context);
    const projectBaseInfoContext = useContext(ProjectBaseInformationContext);
    const account = useAccount();

    const init = async (storeConfig: Store) => {
        console.log('Init store', storeConfig.projectContractAddressOrName);

        const baseInformation = projectBaseInfoContext.getConfig(storeConfig.projectContractAddressOrName);
        const network = resolveNetwork(baseInformation.network);
        const { web3 } = web3Context.getWeb3(network.networkId);
        const priceErc20TokenContract = new web3.eth.Contract(abi, storeConfig.priceTokenContractAddress);
        const wrapper = new ERC20TokenWrapper(priceErc20TokenContract);

        setStoreConfig(storeConfig);
        setWeb3(web3);
        setWrapper(wrapper);
        setIsInitialized(true);
    }

    const buy = async () => {
        if (!web3 || !isInitialized || !wrapper || !storeConfig || !account) {
            return;
        }

        await sendTransaction(
            web3,
            wrapper.contract,
            storeConfig.priceWei,
            account.walletAddress,
            storeConfig.targetWalletAddress
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