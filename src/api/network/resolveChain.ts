import { ProjectChain } from "../project-base-information/ProjectBaseInformation";
import { resolveNetwork } from "./resolveNetwork";

export const resolveChain = (networkId: number): ProjectChain => {
    return resolveNetwork(networkId).symbol.toUpperCase() as ProjectChain;
}