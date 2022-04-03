import React, { useContext } from "react";
import styled from "styled-components";
import { MintingProvider } from "../../../api/minting/MintingContext";
import { resolveNetwork } from "../../../api/network/resolveNetwork";
import { ProjectBaseInformationContext } from "../../../api/project-base-information/ProjectBaseInformationContext";
import { NETWORKS } from "../../../types/Networks";
import { MintingItem } from "./MintingItem";

const PageHeader = styled.h1`
    font-size: 2rem;
    color: #1bf2a4;
    font-weight: 900;
`;

const NetworkHeader = styled.h2`
    font-size: 1.75rem;
    font-weight: 800;
`;

export const MintingList: React.FC = () => {
    const configs = useContext(ProjectBaseInformationContext).getConfigs();
    const stillMinting = configs.filter(item => item.mint && !item.mint.forceEndedState);

    return (
        <>
            <PageHeader className="mb-6">Minting now</PageHeader>

            {NETWORKS.map((network, index) => (
                <div key={index}>
                    <NetworkHeader className="mb-4">{network.name}</NetworkHeader>
                    <div className="flex flex-wrap gap-8 mb-8">
                        {stillMinting
                            .filter(item => resolveNetwork(item.network).networkId === network.networkId)
                            .map((item, index) => {
                                return (
                                    <div key={index}>
                                        <MintingProvider>
                                            <MintingItem baseInformation={item} />
                                        </MintingProvider>
                                    </div>
                                )
                            })}
                    </div>
                </div>
            ))}
        </>
    );
}