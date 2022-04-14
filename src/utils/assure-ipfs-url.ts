
const DEFAULT_PUBLIC_IPFS_GATEWAY = 'https://cloudflare-ipfs.com/ipfs';

const fixLeadingSlash = (uri: string): string => {
    return uri.endsWith('/') ? uri : `${uri}/`;
}

export const assureIpfsUrl = (uri: string, override?: string): string => {
    override = override
        ? fixLeadingSlash(override)
        : '';

    if (uri.startsWith('https://')) {
        if (override) {
            const ipfs = uri.split('/ipfs/')[1];
            return override + ipfs;
        } else {
            return uri;
        }
    } else if (uri.startsWith('ipfs://')) {
        const ipfs = uri.split('://')[1];
        if (override) {
            return override + ipfs;
        } else {
            return fixLeadingSlash(DEFAULT_PUBLIC_IPFS_GATEWAY) + ipfs;
        }
    }

    return '';
}