import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { MintingContext } from '../../../api/minting/MintingContext';
import { ProjectBaseInformation, SingletonProjectBaseInformation } from "../../../api/project-base-information/ProjectBaseInformation"
import { RoundedButton } from '../../../components/RoundedButton';
import { TextFit } from '../../../components/TextFit';
import { MintStateBadge } from '../../../components/MintStateBadge';
import useUser from '../../../api/account/useUser';
import { resolveNetwork } from '../../../api/network/resolveNetwork';
import { MintPrice } from '../../../components/MintPrice';
import { NetworkIcon } from '../../../components/NetworkIcon';
import moment, { Moment } from 'moment';

export type MintingItemProps = {
    singletonBaseInfo: SingletonProjectBaseInformation;
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

const DateText = styled.span`
    font-size: 1.4rem;
    font-weight: 500;
`;

export const MintingItem: React.FC<MintingItemProps> = ({
    singletonBaseInfo
}) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const navigate = useNavigate();
    const minting = useContext(MintingContext);
    const user = useUser();

    const walletAddress = user.account?.walletAddress;
    const hasContract = !!singletonBaseInfo.contractAddress;
    const hasMintSpec = !!singletonBaseInfo.mint;

    const releaseDate: Moment | null = (singletonBaseInfo.releaseDate) ? moment(singletonBaseInfo.releaseDate).utc() : null;

    const isUpcoming = releaseDate && releaseDate.isAfter(new Date());

    useEffect(() => {
        const init = async () => {
            if (!hasContract || !hasMintSpec) {
                return;
            }

            try {
                await minting.init({
                    contractAddress: singletonBaseInfo.contractAddress,
                    liveMintingCount: false
                });
            } catch (e) {
                console.error('Error on minting init', e);
                throw e;
            } finally {
                setIsInitialized(true);
            }
        }

        if (!singletonBaseInfo.contractAddress) {
            setIsInitialized(true);
            return;
        }

        init();
    }, [singletonBaseInfo.contractAddress, walletAddress]);

    if (!isInitialized) {
        return <div>Loading</div>;
    }

    if (!singletonBaseInfo.mint) {
        return null;
    }

    const handleClick = () => {
        navigate(`/projects/${singletonBaseInfo.id}?chain=${singletonBaseInfo.chain}`);
    }

    const network = resolveNetwork(singletonBaseInfo.chain);
    const buttonText = (isUpcoming && minting.mintState === 'NotStarted') ? 'OPEN' : 'TO MINT';

    return (
        <StyledContainer className="rounded-lg">
            {isUpcoming && (
                <DateText>{releaseDate.format('MMMM Do')}</DateText>
            )}
            <StyledHeader className="flex items-center" height={100}>{singletonBaseInfo.name}</StyledHeader>
            <StyledImageContainer className="mb-2">
                {minting.mintState !== 'NotStarted' && (
                    <StyledMintStateBadge mintState={minting.mintState} />
                )}
                <StyledImage src={singletonBaseInfo.mint?.mintImage} />
                <PositionedNetworkIcon networkId={network.networkId} size={35} />
            </StyledImageContainer>
            <StyledPrice
                className='mt-4 mb-4'
                fontSizeRem={2}
                weiPrice={singletonBaseInfo.mint.weiCost}
                symbol={minting.priceSymbol}
                fitToHeight={34}
            />
            <ToMintButton onClick={handleClick}>{buttonText}</ToMintButton>
        </StyledContainer>
    )
}