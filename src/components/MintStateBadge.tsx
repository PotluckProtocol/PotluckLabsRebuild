import styled from "styled-components";
import { MintState } from "../api/minting/MintingContractWrapper";

const Badge = styled.div`
    background-color: white;
    display: inline-block;
    font-weight: 700;
    padding: 1px 12px;
    text-align: center;
    border-radius: 2rem;
    color: #0c6947;
`;

export type MintStateBadgeProps = {
    className?: string;
    mintState: MintState;
}

export const MintStateBadge: React.FC<MintStateBadgeProps> = ({
    className,
    mintState
}) => {
    let stateText: string;
    if (mintState === 'Ended') {
        stateText = 'ENDED';
    } else if (mintState === 'NotStarted') {
        stateText = 'NOT YET';
    } else if (mintState === 'WhitelistOpen') {
        stateText = 'WHITELIST';
    } else {
        stateText = 'LIVE!';
    }

    return <Badge className={className}>{stateText}</Badge>;

}