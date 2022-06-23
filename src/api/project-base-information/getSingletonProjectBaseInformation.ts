import { ProjectBaseInformation, ProjectChain, SingletonProjectBaseInformation } from "./ProjectBaseInformation";

export const getSingletonProjectBaseInformation = (
    baseInformation: ProjectBaseInformation,
    chain: ProjectChain
): SingletonProjectBaseInformation => {
    const { chains, ...rest } = baseInformation;
    const chainInfo = chains[chain];
    if (!chainInfo) {
        throw new Error(`No chain ${chain} for project ${baseInformation.id}`);
    }

    return {
        ...rest,
        chain,
        contractAddress: chainInfo.contractAddress,
        initialSupply: chainInfo.initialSupply,
        externalMintLocation: chainInfo.externalMintLocation,
        mint: chainInfo.mint
    }
}