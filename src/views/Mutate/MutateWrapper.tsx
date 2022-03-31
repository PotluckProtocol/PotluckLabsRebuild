import React, { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import useAccount from "../../api/account/useAccount";
import { MutateProvider } from "../../api/mutate/MutateContext";
import { resolveNetwork } from "../../api/network/resolveNetwork";
import { ProjectBaseInformationContext } from "../../api/project-base-information/ProjectBaseInformationContext";
import { NetworkIcon } from "../../components/NetworkIcon";
import { Mutate } from "./Mutate";

const Title = styled.h1`
    font-weight: 900;
    font-size: 3rem;
    text-align: center;
    line-height: 3rem;
    color: #1bf2a4;
`;

type ContainerProps = {
    disabled: boolean;
}

const Container = styled.div<ContainerProps>`
    position: relative;
    ${(props) => (!!props.disabled && (`
        opacity: .35;
        filter: blur(8px);
    `))}
    `;

const Shroud = styled.div`
    content: ' ';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
`;

export const MutateWrapper: React.FC = () => {
    const [queryParams] = useSearchParams();
    const baseInformationContext = useContext(ProjectBaseInformationContext);
    const account = useAccount();

    const accountNetworkId = account?.network.id;
    const contractAddresses = queryParams.getAll('contractAddress');

    return (
        <div>
            <Title className="my-2 mb-8">Mutate</Title>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                {contractAddresses.map(contractAddress => {
                    const baseInformation = baseInformationContext.getConfig(contractAddress);
                    const network = resolveNetwork(baseInformation.network);
                    const isDisabled = network.networkId !== accountNetworkId;

                    const isConnected = !!account;

                    const serumNotation = (baseInformation.mutate?.serumUnitNotation)
                        ? baseInformation.mutate.serumUnitNotation
                        : 'Serum';

                    let shroudText: string;
                    if (isConnected) {
                        shroudText = 'Change your network.';
                    } else {
                        shroudText = 'Connect your wallet.';
                    }

                    return (
                        <div key={contractAddress} className="relative">
                            <Container disabled={isDisabled}>
                                <MutateProvider >
                                    <Mutate baseInformation={baseInformation} />
                                </MutateProvider>
                            </Container>

                            {isDisabled && (
                                <Shroud className="text-center flex justify-center items-center">
                                    <div>
                                        <NetworkIcon className="inline-block" networkId={network.networkId} />
                                        <div className="mt-6">Mutate your {serumNotation} on {network.name}.</div>
                                        <div style={{ fontWeight: 600 }}>{shroudText}</div>
                                    </div>
                                </Shroud>
                            )}

                        </div>
                    )
                })}
            </div>
        </div >

    );
}