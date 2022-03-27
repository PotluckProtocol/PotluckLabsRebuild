import { useContext } from "react"
import { Web3Context, Web3Item } from "./Web3Context"

export const useWeb3 = (networkId: number): Web3Item => {
    const context = useContext(Web3Context);
    return context.getWeb3(networkId);
}