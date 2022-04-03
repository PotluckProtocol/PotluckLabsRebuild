import React, { ReactNode, useContext, useEffect, useState } from "react";
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
import { MintPrice } from "../../../components/MintPrice";
import { resolveNetwork } from "../../../api/network/resolveNetwork";
import { NetworkIcon } from "../../../components/NetworkIcon";

export type MintProjectProps = {
    contractAddress: string;
    hideCatalogNavigationLink?: boolean;
}

const MintingContainer = styled.div`
    width: 100%;
    max-width: 768px;
    border-radius: 2rem;
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

const StyledMintPrice = styled(MintPrice)`
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
    display: inline-block;
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

const PositionedNetworkIcon = styled(NetworkIcon)`
    right: 1.5rem;
    top: -0.5rem;
    position: absolute;
`;

export const MintProject: React.FC<MintProjectProps> = ({
    contractAddress,
    hideCatalogNavigationLink
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

    const network = resolveNetwork(baseInformation.network);

    const getCost = (amount: number) => {
        return weiToDisplayCost(
            (baseInformation?.mint?.weiCost as number) * amount,
            network,
            { decimals: network.symbol === 'AVAX' ? 1 : 0 }
        )
    }

    const { mintState, whitelistCount } = mintingContext;
    const isWhitelistState = mintState === 'WhitelistOpen';
    const maxPerTx = (isWhitelistState)
        ? Math.min(whitelistCount, baseInformation.mint.maxPerTx)
        : baseInformation.mint.maxPerTx;

    const isConnected = !!account;
    const wrongNetwork = network.networkId !== account?.network.id;
    let mintButtonText = 'Mint';
    if (!isConnected) {
        mintButtonText = 'Connect wallet';
    } else if (wrongNetwork) {
        mintButtonText = 'Wrong network';
    }

    const mintButtonDisabled = !isConnected || wrongNetwork || maxPerTx === 0 || mintAmount === 0 || mintingContext.isMinting;

    const info: ReactNode = (
        <>
            {(isConnected && wrongNetwork) && (<p>Change your network to <b>{network.name}</b>.</p>)}
            {(mintingContext.isMinting) && (<p>Minting in progress.</p>)}
        </>
    )

    return (
        <div>
            <MintingContainer className="p-2">
                <div className="mb-4 px-4">
                    <MintHeader height={100} className="flex items-center justify-center">{baseInformation.name}</MintHeader>
                </div>

                <div className="grid grid-cols-1 md:flex">
                    <MintTooling className="p-4 md:p-8 pt-0 md:pt-0 order-1 md:order-none">
                        <div className="mb-2 flex items-center">
                            <NetworkIcon className="md:hidden inline-block mr-4" size={30} networkId={network.networkId} />
                            <MintStateBadge mintState={mintState} className="inline-block" />
                        </div>

                        <LabelText>Minted:</LabelText>

                        <ProgressBar min={0} height={8} max={baseInformation.maxSupply} value={mintingContext.mintCount} />
                        <div className="flex justify-between">
                            <div></div>
                            <MintCount>{mintingContext.mintCount} / {baseInformation.maxSupply}</MintCount>
                        </div>

                        <LabelText>Price:</LabelText>
                        <StyledMintPrice
                            fontSizeRem={2.5}
                            network={network}
                            weiPrice={baseInformation.mint.weiCost}
                        />

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

                        <div className="mt-6 md:hidden">
                            <StyledRoundedButton disabled={mintButtonDisabled} onClick={handleMintClick}>{mintButtonText}</StyledRoundedButton>
                            <div>{info}</div>
                        </div>
                    </MintTooling>

                    <ImageContainer className="p-4 md:p-8 pt-0 md:pt-0 order-0 md:order-none">
                        <PositionedNetworkIcon className="hidden md:inline-block" size={40} networkId={network.networkId} />
                        <Image className="w-full md:w-auto rounded-xl" src={baseInformation.mint?.mintImage} />
                        <StyledRoundedButton className="hidden md:inline-block" disabled={mintButtonDisabled} onClick={handleMintClick}>{mintButtonText}</StyledRoundedButton>
                        <div className="hidden md:inline-block">{info}</div>
                    </ImageContainer>
                </div>
            </MintingContainer>
            {!hideCatalogNavigationLink && (
                <BackLinkContainer className="my-8">
                    <NavLink to={'/'}>Back to minting catalog</NavLink>
                </BackLinkContainer>
            )}
        </div>
    );
}