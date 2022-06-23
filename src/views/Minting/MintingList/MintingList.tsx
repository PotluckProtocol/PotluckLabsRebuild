import React, { useContext } from "react";
import styled from "styled-components";
import { MintingProvider } from "../../../api/minting/MintingContext";
import { ProjectBaseInformationContext } from "../../../api/project-base-information/ProjectBaseInformationContext";
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
    const configs = useContext(ProjectBaseInformationContext).getSingletonConfigs();
    const allMinting = configs.filter(item => item.mint && !item.mint.forceEndedState);

    const now = Date.now();

    const upcomingMints = allMinting.filter(item => item.releaseDate && new Date(item.releaseDate).valueOf() > now);
    const nowMinting = allMinting.filter(item => item.releaseDate && new Date(item.releaseDate).valueOf() <= now);

    return (
        <>
            {(upcomingMints.length > 0) && (
                <>
                    <PageHeader className="mb-6">Upcoming launches</PageHeader>
                    <div className="flex flex-wrap gap-8 mb-8">
                        {upcomingMints.map((item, index) => {
                            return (
                                <div key={index} className='mx-auto sm:mx-0'>
                                    <MintingProvider>
                                        <MintingItem singletonBaseInfo={item} />
                                    </MintingProvider>
                                </div>
                            )
                        })}
                    </div>
                </>
            )}

            <PageHeader className="mb-6">Minting now</PageHeader>

            <div className="flex flex-wrap gap-8 mb-8">
                {nowMinting.map((item, index) => {
                    return (
                        <div key={index} className='mx-auto sm:mx-0'>
                            <MintingProvider>
                                <MintingItem singletonBaseInfo={item} />
                            </MintingProvider>
                        </div>
                    )
                })}
            </div>
        </>
    );
}