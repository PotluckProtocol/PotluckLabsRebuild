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
    white-space: nowrap;
`;

export type MintStateBadgeProps = {
    className?: string;
    mintState: MintState;
}

export const MintStateBadge: React.FC<MintStateBadgeProps> = ({
    className,
    mintState
}) => {
    let render: boolean = true;
    let stateText: string = '';
    if (mintState === 'NotStarted') {
        render = false;
    } else if (mintState === 'Ended') {
        stateText = 'ENDED';
    } else if (mintState === 'WhitelistOpen') {
        stateText = 'WHITELIST';
    } else {
        stateText = 'LIVE!';
    }

    return (render ? (<Badge className={className}>{stateText}</Badge>) : null);

}