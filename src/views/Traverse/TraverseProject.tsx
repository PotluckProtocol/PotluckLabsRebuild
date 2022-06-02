import classNames from "classnames";
import { useContext, useEffect, useState } from "react"
import { toast } from "react-toastify";
import styled from "styled-components";
import useUser from "../../api/account/useUser";
import { resolveNetwork } from "../../api/network/resolveNetwork";
import { TraversingContext } from "../../api/traversing/TraversingContext"
import { TraversingInfoContext } from "../../api/traversing/TraversingInfoContext";
import Button from "../../components/Button";
import { Loading } from "../../components/Loading";
import { NetworkIcon } from "../../components/NetworkIcon";
import { PreviewTokenImage } from "../../components/PreviewTokenImage";
import useScreenSize from "../../hooks/useScreenSize";


export type TraverseProjectProps = {
    id: string;
}

const Table = styled.table`
    th, td {
        padding: .4rem 2rem;
        white-space: nowrap;
    }

    th {
        text-align: left;
    }

    td { 
        border-bottom: 1px solid #0c6947;

        :last-child {
            width: 100%;
        }
    }

    tr:last-child td {
        border-bottom: 0;
    }
`;

const ButtonNoStyle = styled.button`
    color: #1bf2a4;
`;

const Shroud = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.9);
    color: white;
`;

const SubTitle = styled.div`
    color: white;
    font-weight: 600;
    font-size: .7rem;
`;

const Divider = styled.div`
    border-bottom: 1px solid #1bf2a4;
`;

export const TraverseProject: React.FC<TraverseProjectProps> = ({
    id
}) => {

    const user = useUser();
    const screenSize = useScreenSize();
    const isSmallScreen = screenSize === 'xs' || screenSize === 'sm' || screenSize === 'md' || screenSize === 'lg';
    const [previewedToken, setPreviewedToken] = useState<{ tokenId: number, networkId: number, contractAddress: string } | null>(null);
    const traversingInfoContext = useContext(TraversingInfoContext);
    const traversingContext = useContext(TraversingContext);
    const traversingInfo = traversingInfoContext.getTraversingInfo(id);
    const traversingInfoId = traversingInfo?.id;

    const walletAddress = user.account?.walletAddress;
    const walletNetworkId = user.account?.network.networkId;

    useEffect(() => {
        const init = async () => {
            if (traversingInfo) {
                await traversingContext.init({ traversing: traversingInfo });
            }
        }

        init();
    }, [walletAddress, walletNetworkId, traversingInfoId]);

    if (!traversingContext.isInitialized) {
        return (
            <>
                <div className="flex justify-center mt-6">
                    <Loading size={10} width={125} />
                </div>
                <div className="text-center">Loading tokens...</div>
            </>
        );
    }

    const createTraverseHandler = (tokenId: number, targetNetworkId: number, currentNetworkId: number) => {
        return async () => {
            try {
                const targetNetwork = resolveNetwork(targetNetworkId);
                const currentNetwork = resolveNetwork(currentNetworkId);

                const res = await traversingContext.traverseChains(tokenId, targetNetworkId);
                if (!res) {
                    throw new Error('Traversing failed');
                }

                toast(
                    `Traversed #${tokenId} successfully from ${currentNetwork.name} to ${targetNetwork.name}`,
                    { theme: 'colored', type: 'success' }
                );
            } catch (e) {
                console.log('Error on traversing from', currentNetworkId, 'to', targetNetworkId, 'with error', e);
                toast('Traversing failed', { theme: 'colored', type: 'error' });
            }
        }
    }

    let content: React.ReactNode;
    if (isSmallScreen) {
        content = (
            <div>
                {traversingContext.walletTokens.map((token, index) => {

                    const currentNetwork = resolveNetwork(token.currentNetworkId);
                    const currentNetworkContractAddress = traversingInfo?.chains.find(chain => chain.network.networkId === currentNetwork.networkId)?.contractAddress;
                    const currentlyTraversingItem = traversingContext.currentlyTraversingTokens.find(item => item.tokenId === token.tokenId);;
                    const isTraversing = !!currentlyTraversingItem;
                    const isInConnectedNetwork = walletNetworkId === currentNetwork.networkId;
                    const isLast = index + 1 === traversingContext.walletTokens.length;

                    const handleTokenIdClick = () => {
                        setPreviewedToken({
                            tokenId: token.tokenId,
                            networkId: token.currentNetworkId,
                            contractAddress: currentNetworkContractAddress as string
                        });
                    }

                    return (
                        <>
                            <div>
                                <ButtonNoStyle onClick={handleTokenIdClick}>
                                    Token #{token.tokenId}
                                </ButtonNoStyle>

                                <SubTitle className="mt-4 mb-2">Current network</SubTitle>

                                <div className="flex items-center">
                                    <NetworkIcon className="inline-block mr-2" networkId={token.currentNetworkId} size={30} />
                                    <span>{currentNetwork.name}</span>
                                </div>

                                <SubTitle className="mt-4 mb-2">Traverse to</SubTitle>

                                <div className='relative'>
                                    {
                                        traversingInfo?.chains.filter(chain => chain.network.networkId !== token.currentNetworkId).map(chain => {
                                            const clickHandler = createTraverseHandler(token.tokenId, chain.network.networkId, token.currentNetworkId);
                                            return (
                                                <Button className="mr-2 mb-2" variant="outlined" disabled={isTraversing} onClick={clickHandler}>
                                                    <div className="flex items-center">
                                                        <NetworkIcon className="inline-block mr-2" networkId={chain.network.networkId} size={25} />
                                                        <span>{chain.network.name}</span>
                                                    </div>
                                                </Button>
                                            )
                                        })
                                    }
                                    {isTraversing && (
                                        <Shroud className="flex items-center">
                                            <Loading size={3} width={30} />
                                            Traversing to {resolveNetwork(currentlyTraversingItem.targetNetworkId).name}...
                                        </Shroud>
                                    )}
                                    {!isInConnectedNetwork && (
                                        <Shroud className="flex items-center whitespace-nowrap">
                                            Connected to wrong network
                                        </Shroud>
                                    )}
                                </div>
                            </div>

                            {!isLast && (<Divider className="my-3" />)}
                        </>
                    )
                })}
            </div>
        )
    } else {
        content = (
            <Table>
                <thead>
                    <tr>
                        <th>Token #</th>
                        <th>Current chain</th>
                        <th>Traverse to</th>
                    </tr>
                </thead>
                <tbody>
                    {traversingContext.walletTokens.map(token => {

                        const currentNetwork = resolveNetwork(token.currentNetworkId);
                        const currentNetworkContractAddress = traversingInfo?.chains.find(chain => chain.network.networkId === currentNetwork.networkId)?.contractAddress;
                        const currentlyTraversingItem = traversingContext.currentlyTraversingTokens.find(item => item.tokenId === token.tokenId);;
                        const isTraversing = !!currentlyTraversingItem;
                        const isInConnectedNetwork = walletNetworkId === currentNetwork.networkId;

                        const handleTokenIdClick = () => {
                            setPreviewedToken({
                                tokenId: token.tokenId,
                                networkId: token.currentNetworkId,
                                contractAddress: currentNetworkContractAddress as string
                            });
                        }

                        return (
                            <tr>
                                <td>
                                    <ButtonNoStyle onClick={handleTokenIdClick}>
                                        Token #{token.tokenId}
                                    </ButtonNoStyle>
                                </td>
                                <td className="no-wrap">
                                    <div className="flex items-center">
                                        <NetworkIcon className="inline-block mr-2" networkId={token.currentNetworkId} size={30} />
                                        <span>{currentNetwork.name}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className='relative'>
                                        {!isTraversing && (
                                            traversingInfo?.chains.filter(chain => chain.network.networkId !== token.currentNetworkId).map(chain => {
                                                const clickHandler = createTraverseHandler(token.tokenId, chain.network.networkId, token.currentNetworkId);
                                                return (
                                                    <Button className="mr-2" variant="outlined" disabled={isTraversing} onClick={clickHandler}>
                                                        <div className="flex items-center">
                                                            <NetworkIcon className="inline-block mr-2" networkId={chain.network.networkId} size={25} />
                                                            <span>{chain.network.name}</span>
                                                        </div>
                                                    </Button>
                                                )
                                            }))
                                        }
                                        {isTraversing && (
                                            <Shroud className="flex items-center">
                                                <Loading size={3} width={30} />
                                                Traversing to {resolveNetwork(currentlyTraversingItem.targetNetworkId).name}...
                                            </Shroud>
                                        )}
                                        {!isInConnectedNetwork && (
                                            <Shroud className="flex items-center whitespace-nowrap">
                                                Connected to wrong network
                                            </Shroud>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        )
    }

    return (
        <>
            <div className="mb-4">
                {content}
            </div>
            {previewedToken && (
                <PreviewTokenImage
                    contractAddress={previewedToken.contractAddress}
                    tokenId={previewedToken.tokenId}
                    networkId={previewedToken.networkId}
                    onClose={() => setPreviewedToken(null)}
                />
            )}
        </>

    )

}