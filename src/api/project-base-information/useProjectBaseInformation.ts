import { useContext } from "react";
import { ProjectBaseInformation } from "./ProjectBaseInformation";
import { ProjectBaseInformationContext } from "./ProjectBaseInformationContext";

const useProjectBaseInformation = (contractAddressOrNameIdent: string): ProjectBaseInformation => {
    const context = useContext(ProjectBaseInformationContext);
    const config = context.getConfig(contractAddressOrNameIdent);
    if (!config) {
        const msg = `Could not retrieve baseInformation for ${contractAddressOrNameIdent}`;
        console.log(msg);
        throw new Error(msg);
    }
    return config;
}

export default useProjectBaseInformation;