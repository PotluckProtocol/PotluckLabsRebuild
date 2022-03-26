import React, { useContext } from "react";
import { MintingProvider } from "../../../api/minting/MintingContext";
import { ProjectBaseInformationContext } from "../../../api/project-base-information/ProjectBaseInformationContext";
import { MintingItem } from "./MintingItem";

export const MintingList: React.FC = () => {
    const configs = useContext(ProjectBaseInformationContext).getConfigs();
    const stillMinting = configs.filter(item => !item.mint?.forceEndedState);

    return (
        <div className="flex flex-wrap px-8 gap-8">
            {stillMinting.map((item, index) => {
                return (
                    <div key={index}>
                        <MintingProvider>
                            <MintingItem baseInformation={item} />
                        </MintingProvider>
                    </div>
                )
            })}
        </div>
    );
}