import { useContext } from "react";
import { ProjectBaseInformation } from "./ProjectBaseInformation";
import { ProjectBaseInformationContext } from "./ProjectBaseInformationContext";

const useProjectBaseInformation = (contractAddress: string): ProjectBaseInformation | null => {
    const context = useContext(ProjectBaseInformationContext);
    return context.getConfig(contractAddress);
}

export default useProjectBaseInformation;