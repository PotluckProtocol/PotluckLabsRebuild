import { useContext } from "react";
import styled from "styled-components";
import useUser from "../../api/account/useUser";
import { StoreProvider } from "../../api/stores/StoreContext"
import { StoresContext } from "../../api/stores/StoresContext";
import { ConnectWalletButton } from "../../components/ConnectWalletButton";
import { Loading } from "../../components/Loading";
import { useLabsBalance } from "./labs/useLabsBalance";
import { StoreItem } from "./StoreItem"

const AccountBalance = styled.div`
    font-size: 1.2rem;
`;

const LabsBalanceText = styled.span`
    color: #1bf2a4;
    font-size: 1.6rem;
    font-weight: 600;
`;

export const StoreListing: React.FC = () => {
    const storesContext = useContext(StoresContext);
    const user = useUser();
    const labs = useLabsBalance();

    if (!storesContext.isInitialized) {
        return null;
    }

    if (!user.account) {
        return (
            <div className="mt-8">
                <div className="mb-4 text-center">Connect your wallet to access the $LABS Store.</div>
                <ConnectWalletButton />
            </div>
        )
    }

    const storeConfigs = storesContext.configs;
    return (
        <>
            <AccountBalance className="mb-8 flex justify-center items-center">
                Connected wallet has <LabsBalanceText className='mx-2'>{labs.isLoading ? <Loading width={20} /> : labs.balance.toFixed(2)}</LabsBalanceText> $LABS
            </AccountBalance>

            <p className="mb-12 text-center">
                <b>Warning:</b> Having Whitelist spots doesn’t guarantee you a mint as there might be more Whitelist spots than possible mints.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {
                    storeConfigs.map((configItem, index) => {
                        return (
                            <StoreProvider key={index}>
                                <StoreItem
                                    accountLabsBalance={labs.balance}
                                    storeConfig={configItem}
                                />
                            </StoreProvider>
                        )
                    })
                }
            </div>
        </>
    );
}