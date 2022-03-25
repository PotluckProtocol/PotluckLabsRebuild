import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { MintingContext } from "../../api/minting/MintingContext";
import { ProjectBaseInformationContext } from "../../api/project-base-information/ProjectBaseInformationContext";
import { weiToDisplayCost } from "../../api/utils/wei-to-display-cost";
import { AmountSelector } from "../../components/AmountSelector";
import Button from "../../components/Button";
import { MintStateBadge } from "../../components/MintStateBadge";
import { ProgressBar } from "../../components/ProgressBar";
import { RoundedButton } from "../../components/RoundedButton";
import { TextFit } from "../../components/TextFit";
import { AbiItems } from "../../types/Contracts";
import { Network, NETWORKS } from "../../types/Networks";

export type MintProjectProps = {
    contractAddress: string;
}

export const abi: AbiItems = [{ "inputs": [{ "internalType": "address[]", "name": "_devList", "type": "address[]" }, { "internalType": "uint256[]", "name": "_fees", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "approved", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "_tokenId", "type": "uint256" }], "name": "Migration", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Paused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Unpaused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "devAddress", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "WithdrawFees", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "devAddress", "type": "address" }, { "indexed": false, "internalType": "address", "name": "tokenAddress", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "WithdrawWrongNfts", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "devAddress", "type": "address" }, { "indexed": false, "internalType": "address", "name": "tokenAddress", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "WithdrawWrongTokens", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "_owner", "type": "address" }], "name": "Owned", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "baseExtension", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "baseURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "devFees", "outputs": [{ "internalType": "uint256", "name": "percent", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "emergencyWithdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "getApproved", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" }], "name": "isApprovedForAll", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "maxPerPerson", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "maxPerTx", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "maxSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "mint", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "ownerOf", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "price", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "addressList", "type": "address[]" }], "name": "removeWhiteList", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "royalty", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "royaltyAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "_salePrice", "type": "uint256" }], "name": "royaltyInfo", "outputs": [{ "internalType": "address", "name": "receiver", "type": "address" }, { "internalType": "uint256", "name": "royaltyAmount", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }], "name": "safeMint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes", "name": "_data", "type": "bytes" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "newBaseURI", "type": "string" }], "name": "setBaseURI", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "newMaxBuy", "type": "uint256" }], "name": "setMaxPerPerson", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "newMaxBuy", "type": "uint256" }], "name": "setMaxPerTx", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "newPrice", "type": "uint256" }], "name": "setPrice", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint16", "name": "_royalty", "type": "uint16" }], "name": "setRoyalty", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_royaltyAddress", "type": "address" }], "name": "setRoyaltyAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "string", "name": "uri", "type": "string" }], "name": "setURI", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "tokenByIndex", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }], "name": "tokenExists", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "tokenOfOwnerByIndex", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "tokenURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "updatePausedStatus", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "updateWhitelistStatus", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "_addressList", "type": "address[]" }, { "internalType": "uint256[]", "name": "_valueList", "type": "uint256[]" }], "name": "whiteList", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "whiteListed", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "whitelistedOnly", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_tokenContract", "type": "address" }, { "internalType": "uint256[]", "name": "_id", "type": "uint256[]" }], "name": "withdrawNFT", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_tokenContract", "type": "address" }], "name": "withdrawTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]

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
`

const LabelText = styled.span`
    font-size: 1.5rem;
    color: white;
    font-weight: 600;
    display: block;
`

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

export const MintProject: React.FC<MintProjectProps> = ({
    contractAddress
}) => {
    const baseInformation = useContext(ProjectBaseInformationContext)
        .getConfig(contractAddress);

    const [mintAmount, setMintAmount] = useState(1);
    const [isInitializing, setIsInitializing] = useState(false);
    const mintingContext = useContext(MintingContext);

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
    }, [contractAddress, baseInformation]);



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
            <MintingContainer >
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


        </div>
    );
}