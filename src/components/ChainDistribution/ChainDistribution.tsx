import styled from "styled-components";
import { resolveNetwork } from "../../api/network/resolveNetwork";
import { NetworkItem } from "./NetworkItem";

export type ChainDistributionProps = {
    chains: Array<{ networkId: number, count: number }>;
    maxSupply: number;
    height: number;
}

type CountTextProps = {
    color: string;
}

const CountText = styled.span<CountTextProps>`
    color: ${props => props.color};
    font-size: 1.1rem;
`;

export const ChainDistribution: React.FC<ChainDistributionProps> = ({
    chains,
    maxSupply,
    height
}) => {
    const getPercentage = (count: number): number => count / maxSupply * 100;

    let mintedTotal = 0;
    chains.forEach(chain => mintedTotal += chain.count);
    const unmintedTotal = maxSupply - mintedTotal;
    const unmintedPercenage = getPercentage(unmintedTotal);

    return (
        <div>
            <div>
                {chains.map(chainItem => {
                    const network = resolveNetwork(chainItem.networkId);
                    const percentage = getPercentage(chainItem.count);
                    return (
                        <NetworkItem
                            height={height}
                            color={network.primaryColor}
                            networkId={chainItem.networkId}
                            percentage={percentage}
                        />
                    );
                })}
                {!!unmintedTotal && (
                    <NetworkItem
                        height={height}
                        color={'#ccc'}
                        percentage={unmintedPercenage}
                        text={'Unminted'}
                    />
                )}

                <div style={{ clear: 'both' }} />
            </div>
            <div className="flex justify-center pt-1">
                {chains.map((chainItem, index) => {
                    const network = resolveNetwork(chainItem.networkId);
                    const isLast = index === chains.length - 1;
                    return (
                        <span key={chainItem.networkId}>
                            <CountText color={network.primaryColor}>{chainItem.count}</CountText>
                            {(!isLast || unmintedTotal > 0) && (<span>&nbsp;/&nbsp;</span>)}
                        </span>
                    );
                })}

                {unmintedTotal > 0 && (<CountText color='#ccc'>{unmintedTotal}</CountText>)}
            </div>
        </div >
    )
}