import { BigNumber, Contract } from "ethers";
import { useEffect, useState } from "react";
import useUser from "../../api/account/useUser";
import { weiToNumber } from "../../utils/wei-to-display-cost";
import useInterval from "../useInterval";
import { abi } from "./abi";
import { CHAINLINK_PRICE_FEED_CONTRACTS, PriceFeedToken } from "./ChainLinkPriceFeedContracts";
import { PriceFeedCache } from "./PriceFeedCache";

const CACHE_EXPIRE_TIME_MS = 60000;
const REFETCH_PRICE_DATA_INTERVAL_MS = 60000;

const priceFeedCache = new PriceFeedCache(CACHE_EXPIRE_TIME_MS);

export const useTokenPriceInUSD = (token: PriceFeedToken) => {

    const user = useUser();
    const [price, setPrice] = useState<number | null>(null);

    const fetchPrice = async () => {
        const cachedValue = priceFeedCache.get(token);
        if (cachedValue !== null) {
            setPrice(cachedValue);
        } else {
            try {
                const { contractAddress, decimals, networkId } = CHAINLINK_PRICE_FEED_CONTRACTS[token];
                const contract = new Contract(
                    contractAddress,
                    abi,
                    user.getSignerOrProvider(networkId)
                );

                const answer: BigNumber = await contract.latestAnswer();
                const price = weiToNumber(answer.toString(), {
                    symbol: token,
                    decimals
                });

                setPrice(price);
                priceFeedCache.add(token, price);
            } catch (e) {
                console.log(`Error on fetching price feed for ${token}`, e);
            }
        }
    }

    useEffect(() => {
        setPrice(null);
        fetchPrice();
    }, [token]);

    useInterval(() => {
        fetchPrice();
    }, REFETCH_PRICE_DATA_INTERVAL_MS);

    return price;
}