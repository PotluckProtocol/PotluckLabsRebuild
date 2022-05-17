

const ICON_MAP: { [networkId: number]: string } = {
    // Matic
    137: '/images/Networks/matic.svg',

    // Fantom
    250: '/images/Networks/fantom.svg',
    4002: '/images/Networks/fantom.svg',

    // Avalanche
    43114: '/images/Networks/avalanche.svg'
}

export type NetworkIconProps = {
    className?: string;
    size?: number,
    networkId: number;
}

export const NetworkIcon: React.FC<NetworkIconProps> = ({
    className,
    networkId,
    size
}) => {
    size = size || 40;

    const imageUrl = ICON_MAP[networkId];
    if (!imageUrl) {
        throw new Error(`Could not resolve icon for network ${networkId}`);
    }

    return (
        <img width={size} className={className} src={imageUrl} />
    );
}