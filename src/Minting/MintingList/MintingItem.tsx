import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { MintingContext } from '../../api/minting/MintingContext';
import { ProjectBaseInformation } from "../../api/project-base-information/ProjectBaseInformation"
import { weiToDisplayCost } from "../../api/utils/wei-to-display-cost";
import { RoundedButton } from '../../components/RoundedButton';
import { TextFit } from '../../components/TextFit';
import { NETWORKS } from "../../types/Networks";
import { Network } from '../../types/Networks';
import { abi } from '../MintProject/MintProject';
import { MintStateBadge } from '../../components/MintStateBadge';

export type MintingItemProps = {
    baseInformation: ProjectBaseInformation;
}

const StyledContainer = styled.div`
    width: 200px;
    background: rgb(3,26,18);
    background: linear-gradient(0deg, rgba(3,26,18,1) 0%, rgba(12,105,71,1) 100%);
    text-align: center;
    padding: 10px 20px;
`

const StyledHeader = styled(TextFit)`
    font-weight: 900;
    color: #1bf2a4;
    margin-bottom: 15px;
`;

const StyledImageContainer = styled.div`
    position: relative;
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

const StyledMintStateBadge = styled(MintStateBadge)`
    margin: 0 auto;
    top: -15px;
    right: 50%;
    transform: translate(50%, 0);
    position: absolute;
`;

export const MintingItem: React.FC<MintingItemProps> = ({
    baseInformation
}) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const navigate = useNavigate();
    const minting = useContext(MintingContext);

    const { contractAddress } = baseInformation;

    useEffect(() => {
        const init = async () => {
            if (!baseInformation.mint) {
                return;
            }

            try {
                await minting.init({
                    contractAddress,
                    abi,
                    gasLimit: baseInformation.mint.gasLimit,
                    weiCost: baseInformation.mint.weiCost,
                    liveMintingCount: false
                });
            } catch (e) {
                console.error('Error on minting init', e);
                throw e;
            } finally {
                setIsInitialized(true);
            }
        }

        init();
    }, [contractAddress]);

    if (!isInitialized) {
        return <div>Loading</div>;
    }

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
            <StyledHeader height={100}>{baseInformation.name}</StyledHeader>
            <StyledImageContainer>
                <StyledMintStateBadge mintState={minting.mintState} />
                <StyledImage src={baseInformation.mint?.mintImage} />
            </StyledImageContainer>
            <StyledPrice className="mt-2">{cost}</StyledPrice>
            <RoundedButton onClick={handleClick}>TO MINT</RoundedButton>
        </StyledContainer>
    )
}