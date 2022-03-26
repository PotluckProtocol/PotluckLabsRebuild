import { useContext } from "react";
import { ProjectBaseInformation } from "./ProjectBaseInformation";
import { ProjectBaseInformationContext } from "./ProjectBaseInformationContext";

const useProjectBaseInformation = (contractAddress: string): ProjectBaseInformation => {
    const context = useContext(ProjectBaseInformationContext);
    const config = context.getConfig(contractAddress);
    if (!config) {
        const msg = `Could not retrieve baseInformation for ${contractAddress}`;
        console.log(msg);
        throw new Error(msg);
    }
    return config;
}

export default useProjectBaseInformation;