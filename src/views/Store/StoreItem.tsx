import { useContext, useEffect, useState } from "react"
import styled from "styled-components";
import useAccount from "../../api/account/useAccount";
import useProjectBaseInformation from "../../api/project-base-information/useProjectBaseInformation";
import { Store } from "../../api/stores/Store";
import { StoreContext } from "../../api/stores/StoreContext";
import { TextFit } from "../../components/TextFit";
import { weiToNumber } from "../../utils/wei-to-display-cost";
import { RoundedButton } from "../../components/RoundedButton";
import moment from "moment";
import { ImPriceTag } from 'react-icons/im';
import { LABS_TOKEN } from "./labs/Labs";
import { NetworkIcon } from "../../components/NetworkIcon";
import { toast } from "react-toastify";

export type StoreProps = {
    storeConfig: Store;
    accountLabsBalance: number;
    onAfterBuy?: () => void;
}

type ContainerProps = {
    disabled: boolean;
}

const Shroud = styled.div`
    content: ' ';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
`;


const Container = styled.div<ContainerProps>`
    position: relative;
    background: rgb(3,26,18);
    background: linear-gradient(0deg, rgba(3,26,18,1) 0%, rgba(12,105,71,1) 100%);
    text-align: center;
    padding: 0.5rem;
    border-radius: 1.5rem;

    ${(props) => (!!props.disabled && (`
        opacity: .35;
        filter: blur(8px);
    `))}
`;

const CoverImage = styled.img`
    border-radius: 1rem;
    max-width: 75%;
    margin: 0 auto;
    box-shadow: rgba(27, 242, 165, 0.2) 1px 1px 10px 1px;
`;

const Content = styled.div`
    padding: 0.5rem 0.5rem 0;
`;

const Title = styled(TextFit)`
    font-weight: 800;
    color: #1bf2a4;
`;

const PriceContainer = styled.div`
    color: #1bf2a4;
`;

const PriceLabel = styled.div`
    background-color: #094b33;
    font-size: .9rem;
    padding: .42rem .5rem;
    border-radius: .5rem;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border: 1px solid #1bf2a4;
    border-right: 0;
`;

const PriceAmount = styled.div`
    background-color: #094b33;
    padding: .1rem .5rem;
    border-radius: .5rem;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border: 1px solid #1bf2a4;
`;

const Price = styled.span`
    font-size: 1.3rem;
    font-weight: 600;
`;

const Symbol = styled.span`
    font-size: 1rem;
`;

const BuyButton = styled(RoundedButton)`
    font-size: 1.1rem;
`;

const SaleEndsLabel = styled.div`
    font-size: .7rem;
`;

const SaleEndDate = styled.div`

`;

const SaleEnded = styled.div`
    font-size: 1.2rem;
    font-weight: 600;
`;

const Disclaimer = styled.div`
    font-size: .7rem;
`



export const StoreItem: React.FC<StoreProps> = ({
    accountLabsBalance,
    storeConfig,
    onAfterBuy
}) => {

    const [isBuying, setIsBuying] = useState(false);
    const account = useAccount()
    const storeContext = useContext(StoreContext);
    const baseInformation = useProjectBaseInformation(storeConfig.projectContractAddressOrName);
    const walletAddress = account?.walletAddress;

    useEffect(() => {
        if (walletAddress) {
            const init = async () => {
                await storeContext.init(storeConfig);
            }
            init();
        }
    }, [walletAddress]);

    if (!storeContext || !storeContext.isInitialized) {
        return null;
    }

    const handleClick = async () => {
        setIsBuying(true);
        try {
            await storeContext.buy();
            if (typeof onAfterBuy === 'function') {
                onAfterBuy();
            }
            toast('Payment transaction sent successfully.', { type: 'success', theme: 'colored' });
        } catch (e) {
            console.log('Error on sending payment transaction', e);
            toast('Sending transaction failed, please try again later.', { type: 'error', theme: 'colored' });
        } finally {
            setIsBuying(false);
        }
    }

    const itemPriceNumeric = weiToNumber(storeConfig.priceWei, LABS_TOKEN);
    const isWrongNetwork = account?.network.id !== 250;
    const nowMs = Date.now();
    const saleActive = storeConfig.saleEndsOn.valueOf() > nowMs;
    const accountHasEnoughBalance = accountLabsBalance >= itemPriceNumeric;
    const buyButtonDisabled = !account || !saleActive || isBuying || !accountHasEnoughBalance;

    return (
        <div className="relative">
            <Container disabled={isWrongNetwork}>
                <Content>
                    <div>Whitelist spot for</div>
                    <Title height={40} className="my-2 flex items-center justify-center">{baseInformation.name}</Title>
                </Content>

                <CoverImage src={baseInformation.coverImage} />

                {saleActive ? (
                    <div className="text-center mt-4">
                        <SaleEndsLabel>Sale ends on</SaleEndsLabel>
                        <SaleEndDate>{moment(storeConfig.saleEndsOn).utc().format('MMMM Do, h:mm A')} UTC</SaleEndDate>
                    </div>
                ) : (
                    <SaleEnded className="text-center mt-4">Sale has been ended.</SaleEnded>
                )}

                <div className="flex justify-center my-4">
                    <PriceContainer className="flex items-center">
                        <PriceLabel>
                            <ImPriceTag size={21} />
                        </PriceLabel>
                        <PriceAmount className="flex items-center">
                            <Price>{itemPriceNumeric.toFixed(0)}</Price>
                            <Symbol>&nbsp;$LABS</Symbol>
                        </PriceAmount>
                    </PriceContainer>
                </div>

                <BuyButton className='mt-2' disabled={buyButtonDisabled} onClick={handleClick}>Buy</BuyButton>

                <Disclaimer className='mt-2'>$LABS are sent into Potluck Labs wallet directly. Whitelist spot will be available on mint.</Disclaimer>


            </Container>

            {isWrongNetwork && (
                <Shroud className="text-center flex justify-center items-center">
                    <div>
                        <NetworkIcon className="inline-block" networkId={250} />
                        <div className="mt-6">Currently only available on Fantom Opera</div>
                    </div>
                </Shroud>
            )}
        </div>
    )
}