import { PropsWithChildren, ReactElement } from "react";

export type TabProps = {
    id: string;
    header: string;
}

export type TabReactElement = ReactElement<PropsWithChildren<TabProps>, typeof Tab>;

export const Tab: React.FC<TabProps> = ({
    children,
    id
}) => {
    return (
        <div>
            {children}
        </div>
    )
}