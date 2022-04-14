import React from "react";
import { useParams } from "react-router";
import { MintingProvider } from "../../../api/minting/MintingContext";
import { MintProject } from "./MintProject";

type RouteParams = {
    contractAddress: string;
}

export type MintProjectWrapperProps = {
    contractAddress?: string;
}

export const MintProjectWrapper: React.FC<MintProjectWrapperProps> = (props) => {
    const params = useParams<RouteParams>();
    const contractAddress: string = props.contractAddress ? props.contractAddress : params.contractAddress as string;

    return (
        <MintingProvider>
            <MintProject contractAddress={contractAddress} />
        </MintingProvider>
    );
}