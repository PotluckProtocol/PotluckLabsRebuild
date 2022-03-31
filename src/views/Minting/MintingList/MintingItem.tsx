import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { MintingContext } from '../../../api/minting/MintingContext';
import { ProjectBaseInformation } from "../../../api/project-base-information/ProjectBaseInformation"
import { RoundedButton } from '../../../components/RoundedButton';
import { TextFit } from '../../../components/TextFit';
import { MintStateBadge } from '../../../components/MintStateBadge';
import { abi } from '../abi';
import useAccount from '../../../api/account/useAccount';
import { resolveNetwork } from '../../../api/network/resolveNetwork';
import { MintPrice } from '../../../components/MintPrice';
import { NetworkIcon } from '../../../components/NetworkIcon';

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

const StyledPrice = styled(MintPrice)`
    font-weight: 900;
    color: #1bf2a4;
`

const StyledMintStateBadge = styled(MintStateBadge)`
    margin: 0 auto;
    top: -15px;
    right: 50%;
    transform: translate(50%, 0);
    position: absolute;
`;

const PositionedNetworkIcon = styled(NetworkIcon)`
    top: -0.25rem;
    left: -0.25rem;
    position: absolute;
`;

const ToMintButton = styled(RoundedButton)`
    font-size: 1.1rem;
    line-height: 1.7rem;
`;

export const MintingItem: React.FC<MintingItemProps> = ({
    baseInformation
}) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const navigate = useNavigate();
    const minting = useContext(MintingContext);
    const account = useAccount();

    const walletAddress = account?.walletAddress;

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
    }, [contractAddress, walletAddress]);

    if (!isInitialized) {
        return <div>Loading</div>;
    }

    if (!baseInformation.mint) {
        return null;
    }

    const handleClick = () => {
        navigate(`/minting/${baseInformation.contractAddress}`)
    }

    const network = resolveNetwork(baseInformation.network);

    return (
        <StyledContainer className="rounded-lg">
            <StyledHeader height={100}>{baseInformation.name}</StyledHeader>
            <StyledImageContainer>
                <StyledMintStateBadge mintState={minting.mintState} />
                <StyledImage src={baseInformation.mint?.mintImage} />
                <PositionedNetworkIcon networkId={network.networkId} size={35} />
            </StyledImageContainer>
            <StyledPrice
                className='my-4'
                fontSizeRem={2}
                weiPrice={baseInformation.mint.weiCost}
                network={network}
                fitToHeight={34}
            />
            <ToMintButton onClick={handleClick}>TO MINT</ToMintButton>
        </StyledContainer>
    )
}