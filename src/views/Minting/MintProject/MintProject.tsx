import React, { ReactNode, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { MintingContext } from "../../../api/minting/MintingContext";
import { ProjectBaseInformationContext } from "../../../api/project-base-information/ProjectBaseInformationContext";
import { weiToDisplayCost } from "../../../utils/wei-to-display-cost";
import { AmountSelector } from "../../../components/AmountSelector";
import { ProgressBar } from "../../../components/ProgressBar";
import { RoundedButton } from "../../../components/RoundedButton";
import { TextFit } from "../../../components/TextFit";
import { MintPrice } from "../../../components/MintPrice";
import { resolveNetwork } from "../../../api/network/resolveNetwork";
import { NetworkIcon } from "../../../components/NetworkIcon";
import moment from "moment";
import { Reveal } from "./Reveal";
import useUser from "../../../api/account/useUser";
import { toast } from "react-toastify";
import { InsufficientMintingBalanceError } from "../../../api/minting/MintingContractWrapper";
import { BigNumber, ethers, utils } from "ethers";
import { useTokenPriceInUSD } from "../../../hooks/useTokenPriceInUSD/useTokenPriceInUSD";

export type MintProjectProps = {
    contractAddress: string;
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

const PositionedNetworkIcon = styled(NetworkIcon)`
    right: 1.5rem;
    top: -0.5rem;
    position: absolute;
`;

const InfoBox = styled.div`
    border-radius: .5rem;
    padding: .5rem 1rem;
    background-color: #063323;
`;

const InfoBoxHeader = styled.h3`
    font-weight: 700;
    font-size: 1.2rem;
    color: #1bf2a4;
`;

const InfoBoxContent = styled.div`
    font-size: 0.9rem;
`;

const TotalUSDPrice = styled.span`
    font-size: .7rem;
    margin-left: .3rem;
`;

export const MintProject: React.FC<MintProjectProps> = ({
    contractAddress
}) => {
    const user = useUser();
    const singletonBaseInfo = useContext(ProjectBaseInformationContext)
        .getSingletonConfig(contractAddress);
    const network = resolveNetwork(singletonBaseInfo.chain);


    const [mintAmount, setMintAmount] = useState(1);
    const [isInitializing, setIsInitializing] = useState(false);
    const mintingContext = useContext(MintingContext);

    const [isRevealButtonVisible, setIsRevealButtonVisible] = useState(false);
    const [mintedTokenIds, setMintedTokenIds] = useState<number[]>([]);
    const tokenUSDPrice = useTokenPriceInUSD(network.symbol as any);

    const walletAddress = user.account?.walletAddress;
    const hasUSDPrice = (typeof tokenUSDPrice === 'number') && !singletonBaseInfo?.mint?.priceErc20Token;

    useEffect(() => {
        const init = async () => {
            setIsInitializing(true);

            if (!singletonBaseInfo.mint) {
                return;
            }

            try {
                await mintingContext.init({
                    contractAddress,
                    liveMintingCount: true,
                    liveMintingState: true
                });
            } catch (e) {
                console.error('Error on minting init', e);
                throw e;
            } finally {
                setIsInitializing(false);
            }
        }

        init();
    }, [contractAddress, walletAddress, singletonBaseInfo]);

    const doMint = async () => {
        try {
            const res = await mintingContext.mint(mintAmount);
            if (Array.isArray(res.tokenIds)) {
                setMintedTokenIds([...mintedTokenIds, ...res.tokenIds]);
                if (!singletonBaseInfo.mint?.noReveal) {
                    setIsRevealButtonVisible(true);
                }
            }
        } catch (e: any) {
            if (e instanceof InsufficientMintingBalanceError) {
                toast('Insufficient wallet balance', { type: 'error', theme: 'colored' });
            }
        }
    }

    const doApproval = async () => {
        try {
            await mintingContext.approve(mintAmount);
        } catch (e: any) {
            toast('Approval failed', { type: 'error', theme: 'colored' });
        }
    }

    const handleAmountChange = (value: number) => {
        setMintAmount(value);
    }

    if (!singletonBaseInfo.mint) {
        return null;
    }

    if (!mintingContext.isInitialized && isInitializing) {
        return <div>Initializing</div>;
    }

    const getCost = (amount: number): string => {
        if (singletonBaseInfo?.mint?.weiCost) {
            const symbol = mintingContext.priceSymbol;
            const decimals = symbol === 'AVAX' ? 1 : 0
            const totalAmount = BigNumber.from(singletonBaseInfo.mint.weiCost).mul(amount);

            return (+utils.formatEther(totalAmount)).toFixed(decimals) + ' ' + symbol;
        } else {
            return '';
        }
    }

    const getUsdCost = (amount: number): string => {
        if (typeof tokenUSDPrice === 'number' && !singletonBaseInfo?.mint?.priceErc20Token && singletonBaseInfo?.mint?.weiCost) {
            const totalPriceWei = BigNumber.from(singletonBaseInfo.mint.weiCost).mul(amount);
            return '$' + ((+utils.formatEther(totalPriceWei)) * tokenUSDPrice).toFixed(2);
        } else {
            return '';
        }
    }

    let { mintState, whitelistCount } = mintingContext;
    const isWhitelistState = mintState === 'WhitelistOpen';
    const maxPerTx = (isWhitelistState)
        ? Math.min(whitelistCount, singletonBaseInfo.mint.maxPerTx)
        : singletonBaseInfo.mint.maxPerTx;

    const soldOut = mintState === 'Ended';
    const isMintableState = mintState === 'Open' || isWhitelistState;
    const isConnected = !!user.account;
    const wrongNetwork = network.networkId !== user.account?.network.networkId;

    let mintButtonDisabled = (
        !isConnected ||
        !isMintableState ||
        wrongNetwork ||
        maxPerTx === 0 ||
        mintAmount === 0 ||
        mintingContext.isMintInProgress
    );

    let mintButtonHandler: () => void = doMint;
    let mintButtonText = 'Mint';
    if (soldOut) {
        mintButtonText = 'SOLD OUT!';
    } else if (!isConnected) {
        mintButtonText = 'Not connected';
    } else if (wrongNetwork) {
        mintButtonText = 'Wrong network';
    } else if (mintingContext.isRequiringApproval) {

        // If mint is based on any ERC20 token, not native

        const totalPrice = mintingContext.countTotalPrice(mintAmount);
        if (mintingContext.isApproving) {
            mintButtonDisabled = true;
            mintButtonText = 'Approving...';
        } else if (totalPrice.gt(mintingContext.balance)) {
            mintButtonDisabled = true;
            mintButtonText = 'Insufficient balance';
        } else if (totalPrice.gt(mintingContext.allowance)) {
            mintButtonText = 'Approve';
            mintButtonHandler = doApproval;
        }
    }

    const info: ReactNode = (
        <>
            {(isConnected && wrongNetwork) && (<p>Change your network to <b>{network.name}</b>.</p>)}
            {(mintingContext.isMintInProgress) && (<p>Minting in progress.</p>)}
        </>
    );

    return (
        <div>
            <MintingContainer className="p-2">
                <div className="mb-4 px-4">
                    <MintHeader height={100} className="flex items-center justify-center">{singletonBaseInfo.name}</MintHeader>
                </div>

                <div className="grid grid-cols-1 md:flex">
                    <MintTooling className="p-4 md:p-8 pt-0 md:pt-0 order-1 md:order-none">

                        {/* Alternative network icon for small screens */}
                        <div className="md:hidden mb-4 flex justify-center">
                            <NetworkIcon size={50} networkId={network.networkId} />
                        </div>

                        {!!singletonBaseInfo.mint?.priceErc20Token && (
                            <InfoBox className="mb-3">
                                <InfoBoxHeader>ERC20 token mint!</InfoBoxHeader>
                                <InfoBoxContent>
                                    This project is minted with ERC20 ({mintingContext.priceSymbol}) token. Approval is required before minting!
                                </InfoBoxContent>
                            </InfoBox>
                        )}

                        {mintState === 'Open' && (
                            <InfoBox className="mb-3">
                                <InfoBoxHeader>Minting now!</InfoBoxHeader>
                                <InfoBoxContent>
                                    This project is open for minting.
                                </InfoBoxContent>
                            </InfoBox>
                        )}

                        {soldOut && (
                            <InfoBox className="mb-3">
                                <InfoBoxHeader>Sold out!</InfoBoxHeader>
                                <InfoBoxContent>
                                    This project is sold out.
                                </InfoBoxContent>
                            </InfoBox>
                        )}

                        {mintState === 'NotStarted' && (
                            <InfoBox className="mb-3">
                                <InfoBoxHeader>Launching soon!</InfoBoxHeader>
                                {singletonBaseInfo.whitelistDate && (
                                    <InfoBoxContent className="mb-2">
                                        Whitelist presale starts on {`${moment(singletonBaseInfo.whitelistDate).utc().format('MMMM Do, h:mm A')} UTC`}
                                    </InfoBoxContent>
                                )}
                                <InfoBoxContent>
                                    Public sale starts on {`${moment(singletonBaseInfo.releaseDate).utc().format('MMMM Do, h:mm A')} UTC`}
                                </InfoBoxContent>
                            </InfoBox>
                        )}

                        {mintState === 'WhitelistOpen' && (
                            <InfoBox className="mb-3">
                                <InfoBoxHeader>Whitelist sale is open!</InfoBoxHeader>
                                <InfoBoxContent>
                                    {isConnected
                                        ? <>This wallet is eligible for <b>{whitelistCount}</b> whitelisted presale spots.</>
                                        : <>Connect your wallet to see your eligibility for the presale whitelist.</>}
                                </InfoBoxContent>
                                <InfoBoxContent className="mt-2">
                                    Public sale starts on {`${moment(singletonBaseInfo.releaseDate).utc().format('MMMM Do, h:mm A')} UTC`}
                                </InfoBoxContent>
                            </InfoBox>
                        )}

                        {!['NotStarted', 'Ended'].includes(mintState) && (
                            <>
                                <LabelText>Minted:</LabelText>
                                <ProgressBar min={0} height={8} max={singletonBaseInfo.initialSupply} value={mintingContext.mintCount} />
                                <div className="flex justify-between">
                                    <div />
                                    <MintCount>{Math.min(mintingContext.mintCount, singletonBaseInfo.initialSupply)} / {singletonBaseInfo.initialSupply}</MintCount>
                                </div>
                            </>
                        )}

                        {/* Omnichain supplys might vary so if mint state is ended show always whole supply minted */}
                        {mintState === 'Ended' && (
                            <>
                                <LabelText>Minted:</LabelText>
                                <ProgressBar min={0} height={8} max={singletonBaseInfo.initialSupply} value={singletonBaseInfo.initialSupply} />
                                <div className="flex justify-between">
                                    <div />
                                    <MintCount>{singletonBaseInfo.initialSupply} / {singletonBaseInfo.initialSupply}</MintCount>
                                </div>
                            </>
                        )}

                        <LabelText>Price:</LabelText>
                        <StyledMintPrice
                            fontSizeRem={2.5}
                            symbol={mintingContext.priceSymbol}
                            weiPrice={singletonBaseInfo.mint.weiCost}
                            usdPricePerUnit={hasUSDPrice ? tokenUSDPrice : undefined}
                        />

                        <div className="mt-3">
                            <LabelText>Amount:</LabelText>
                            <AmountSelector min={0} max={maxPerTx} value={maxPerTx === 0 ? 0 : mintAmount} onAmountChange={handleAmountChange} />
                            <div className="mt-3">
                                Price in total: {getCost(mintAmount)}
                                {hasUSDPrice && (<TotalUSDPrice>({getUsdCost(mintAmount)})</TotalUSDPrice>)}
                            </div>
                        </div>

                        <div className="mt-6 md:hidden">
                            <StyledRoundedButton disabled={mintButtonDisabled} onClick={mintButtonHandler}>{mintButtonText}</StyledRoundedButton>
                            <div>{info}</div>

                            {isRevealButtonVisible && (
                                <Reveal
                                    className="mb-10"
                                    tokenIds={mintedTokenIds}
                                    shadowImage={singletonBaseInfo.coverImage}
                                />
                            )}
                        </div>
                    </MintTooling>

                    <ImageContainer className="p-4 md:p-8 pt-0 md:pt-0 order-0 md:order-none">
                        <PositionedNetworkIcon className="hidden md:inline-block" size={40} networkId={network.networkId} />
                        <Image className="w-full md:w-auto rounded-xl" src={singletonBaseInfo.mint?.mintImage} />
                        <StyledRoundedButton className="hidden md:inline-block" disabled={mintButtonDisabled} onClick={mintButtonHandler}>{mintButtonText}</StyledRoundedButton>
                        <div className="hidden md:block">{info}</div>
                        {isRevealButtonVisible && (
                            <div className="hidden md:block">
                                <Reveal
                                    className="mb-10"
                                    tokenIds={mintedTokenIds}
                                    shadowImage={singletonBaseInfo.coverImage}
                                />
                            </div>
                        )}
                    </ImageContainer>
                </div>
            </MintingContainer >
        </div >
    );
}