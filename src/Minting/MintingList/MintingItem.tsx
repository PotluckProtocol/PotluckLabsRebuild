import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { ProjectBaseInformation } from "../../api/project-base-information/ProjectBaseInformation"
import { weiToDisplayCost } from "../../api/utils/wei-to-display-cost";
import { NETWORKS } from "../../types/Networks";
import { Network } from '../../types/Networks';

export type MintingItemProps = {
    baseInformation: ProjectBaseInformation;
}

const StyledContainer = styled.div`
    width: 200px;
    background: rgb(3,26,18);
    background: linear-gradient(0deg, rgba(3,26,18,1) 0%, rgba(12,105,71,1) 100%);
    text-align: center;
    padding: 10px 30px;
`

const StyledHeader = styled.h2`
    font-weight: 900;
    font-size: 35px;
    line-height: 35px;
    margin-bottom: 20px;
    color: #1bf2a4;
`;

const StyledImage = styled.img`
    box-shadow: rgba(27, 242, 165, 0.4) 1px 1px 40px 1px;
    width: 200px;
    margin: 0 auto;
    border-radius: 2rem;
`;

const StyledPrice = styled.div`
    font-weight: 900;
    font-size: 30px;
    line-height: 30px;
    margin: 20px 0;
    color: #1bf2a4;
`

const StyledButton = styled.button`
    font-weight: 900;
    background-color: #1bf2a4;
    border-radius: 2rem;
    color: black;
    padding: 0 20px;
    margin-bottom: 10px;
`;

export const MintingItem: React.FC<MintingItemProps> = ({
    baseInformation
}) => {
    const navigate = useNavigate();

    if (!baseInformation.mint) {
        return null;
    }

    const handleClick = () => {
        navigate(`${baseInformation.contractAddress}`)
    }

    const cost = weiToDisplayCost(
        baseInformation.mint.weiCost,
        NETWORKS.find(network => network.symbol === 'FTM') as Network,
        { decimals: 0 }
    );

    return (
        <StyledContainer className="rounded-lg">
            <StyledHeader>{baseInformation.name}</StyledHeader>
            <StyledImage src={baseInformation.mint?.mintImage} />
            <StyledPrice className="mt-2">{cost}</StyledPrice>
            <StyledButton onClick={handleClick}>TO MINT</StyledButton>
        </StyledContainer>
    )
}