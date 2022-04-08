export type SecMarketLinkProps = React.PropsWithChildren<{
    className?: string;
    nftKey?: { collectionUrlPart?: string };
}>;

export const SecMarketLink = (props: SecMarketLinkProps) => {

    let url: string = '';
    if (props.nftKey) {
        url += 'https://nftkey.app';
        if (props.nftKey.collectionUrlPart) {
            url += `/collections/${props.nftKey.collectionUrlPart}/`;
        }
    }

    return (
        <a href={url} className={props.className} target={"_blank"}>
            {props.children}
        </a>
    )
}