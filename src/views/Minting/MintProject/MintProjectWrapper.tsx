import React from "react";
import { useParams } from "react-router";
import { MintingProvider } from "../../../api/minting/MintingContext";
import { MintProject } from "./MintProject";

type RouteParams = {
    contractAddress: string;
}

export const MintProjectWrapper: React.FC = () => {
    const params = useParams<RouteParams>();

    return (
        <MintingProvider>
            <MintProject contractAddress={params.contractAddress as string} />
        </MintingProvider>
    );
}