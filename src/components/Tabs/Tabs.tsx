import { ComponentPropsWithoutRef } from "react";
import { PropsWithoutRef } from "react";
import styled from "styled-components";
import { TabReactElement } from "./Tab";

export type TabsProps = {
    className?: string;
    activeTabId: string;
    onTabChange: (tabId: string) => void;
}

const TabItem = styled.li`
    padding: 0;
    margin: 0;
`;

type TabItemButtomProps = ComponentPropsWithoutRef<'button'> & {
    active: boolean;
}

const TabItemButton = styled.button<TabItemButtomProps>`
    background-color: ${props => props.active ? '#0c6947' : 'none'};
    transition: background-color 100ms linear;
    border: none;
    font-size: 1rem;
    font-weight: 600;
    border-top-right-radius: .25rem;
    border-top-left-radius: .25rem;
    padding: .3rem 1rem;
`;

const TabContent = styled.div`
    padding: 1rem;
    border: 1px solid #0c6947;
`;

export const Tabs: React.FC<TabsProps> = ({
    activeTabId,
    onTabChange,
    className,
    children
}) => {
    const tabChildren = (children as TabReactElement[]).filter(child => child && child.type.displayName === 'Tab');

    let activeTab = activeTabId;
    let activeTabContent = tabChildren.find(child => child.props.id === activeTabId)?.props.children;
    if (!activeTabContent && tabChildren.length > 0) {
        activeTab = tabChildren[0].props.id;
        activeTabContent = tabChildren[0].props.children;
    }

    const headerItems = tabChildren.map(({ props: childProps }, index) => (
        <TabItem key={index} role="tab">
            <TabItemButton active={childProps.id === activeTab} onClick={() => onTabChange(childProps.id)}>
                {childProps.header}
            </TabItemButton>
        </TabItem>
    ));

    return (
        <div className={className}>
            <ul className="flex justify-start items-center" role="tablist">
                {headerItems}
            </ul>
            <TabContent>
                {activeTabContent}
            </TabContent>
        </div>
    )
}