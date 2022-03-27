import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { MintingContext } from "../../../api/minting/MintingContext";
import { ProjectBaseInformationContext } from "../../../api/project-base-information/ProjectBaseInformationContext";
import { weiToDisplayCost } from "../../../utils/wei-to-display-cost";
import { AmountSelector } from "../../../components/AmountSelector";
import { MintStateBadge } from "../../../components/MintStateBadge";
import { ProgressBar } from "../../../components/ProgressBar";
import { RoundedButton } from "../../../components/RoundedButton";
import { TextFit } from "../../../components/TextFit";
import { Network, NETWORKS } from "../../../types/Networks";
import { abi } from "../abi";
import useAccount from "../../../api/account/useAccount";

export type MintProjectProps = {
    contractAddress: string;
}

const MintingContainer = styled.div`
    width: 100%;
    max-width: 768px;
    border-radius: 2rem;
    padding: 20px;
    margin: 0 auto;
    background: rgb(3,26,18);
    background: linear-gradient(0deg, rgba(3,26,18,1) 0%, rgba(12,105,71,1) 100%);
`;

const MintTooling = styled.div`
   width: 100%;
`;

const MintCount = styled.div``;

const MintHeader = styled(TextFit)`
    margin: 0;
    text-align: center;
    font-weight: 900;
    color: #1bf2a4;
`;

const LabelText = styled.span`
    font-size: 1.5rem;
    color: white;
    font-weight: 600;
    display: block;
`;

const PriceText = styled.span`
    font-size: 2.5rem;
    line-height: 2.5rem;
    color: #1bf2a4;
    font-weight: 800;
    display: block;
`;

const ImageContainer = styled.div`
    text-align: center;
    position: relative;
`;

const Image = styled.img`
    box-shadow: rgba(27, 242, 165, 0.4) 1px 1px 40px 1px;
    max-width: 250px;
`;

const StyledRoundedButton = styled(RoundedButton)`
    font-size: 1.4rem;
    padding: 0 30px;
    position: relative;
    bottom: 10px;
`;

const BackLinkContainer = styled.div`
    width: 100%;
    max-width: 768px;
    margin-right: auto;
    margin-left: auto;
    text-align: center;
    font-size: 1.25rem;
`;

export const MintProject: React.FC<MintProjectProps> = ({
    contractAddress
}) => {
    const account = useAccount();
    const baseInformation = useContext(ProjectBaseInformationContext)
        .getConfig(contractAddress);

    const [mintAmount, setMintAmount] = useState(1);
    const [isInitializing, setIsInitializing] = useState(false);
    const mintingContext = useContext(MintingContext);

    const walletAddress = account?.walletAddress;

    useEffect(() => {
        const init = async () => {
            setIsInitializing(true);

            if (!baseInformation.mint) {
                return;
            }

            try {
                await mintingContext.init({
                    contractAddress,
                    abi,
                    gasLimit: baseInformation.mint.gasLimit,
                    weiCost: baseInformation.mint.weiCost,
                    liveMintingCount: true
                });
            } catch (e) {
                console.error('Error on minting init', e);
                throw e;
            } finally {
                setIsInitializing(false);
            }
        }

        init();
    }, [contractAddress, walletAddress, baseInformation]);

    const handleMintClick = async () => {
        await mintingContext.mint(mintAmount);
    }

    const handleAmountChange = (value: number) => {
        setMintAmount(value);
    }

    if (!baseInformation.mint) {
        return null;
    }

    if (!mintingContext.isInitialized && isInitializing) {
        return <div>Initializing</div>;
    }

    const getCost = (amount: number) => {
        return weiToDisplayCost(
            (baseInformation?.mint?.weiCost as number) * amount,
            NETWORKS.find(item => item.symbol === 'FTM') as Network,
            { decimals: 0 }
        )
    }

    const { mintState, whitelistCount } = mintingContext;
    const isWhitelistState = mintState === 'WhitelistOpen';
    const maxPerTx = (isWhitelistState)
        ? Math.min(whitelistCount, baseInformation.mint.maxPerTx)
        : baseInformation.mint.maxPerTx;

    const mintButtonDisabled = (maxPerTx === 0 || mintAmount === 0);

    return (
        <div>
            <MintingContainer>
                <div className="mb-4">
                    <MintHeader height={100} className="flex items-center justify-center">{baseInformation.name}</MintHeader>
                </div>

                <div className="flex justify-between">
                    <MintTooling className="p-8 pt-0">
                        <div className="mb-2">
                            <MintStateBadge mintState={mintState} />
                        </div>

                        <LabelText>Minted:</LabelText>

                        <ProgressBar min={0} height={8} max={baseInformation.maxSupply} value={mintingContext.mintCount} />
                        <div className="flex justify-between">
                            <div></div>
                            <MintCount>{mintingContext.mintCount} / {baseInformation.maxSupply}</MintCount>
                        </div>

                        <LabelText>Price:</LabelText>
                        <PriceText>{getCost(1)}</PriceText>

                        <div className="mt-3">
                            <LabelText>Amount:</LabelText>
                            <AmountSelector min={0} max={maxPerTx} value={maxPerTx === 0 ? 0 : mintAmount} onAmountChange={handleAmountChange} />
                            <div className="mt-3">Price in total: {getCost(mintAmount)}</div>
                        </div>

                        {isWhitelistState && (
                            <div className="mt-3">
                                <div className="mt-3">The wallet is eligible for <b>{whitelistCount}</b> whitelist mints.</div>
                            </div>
                        )}
                    </MintTooling>

                    <ImageContainer className="p-8 pt-0">
                        <Image className="rounded-xl" src={baseInformation.mint?.mintImage} />
                        <StyledRoundedButton disabled={mintButtonDisabled} onClick={handleMintClick}>Mint</StyledRoundedButton>
                    </ImageContainer>
                </div>
            </MintingContainer>

            <BackLinkContainer className="mt-8">
                <NavLink to={'/minting'}>Back to minting catalog</NavLink>
            </BackLinkContainer>
        </div>
    );
}