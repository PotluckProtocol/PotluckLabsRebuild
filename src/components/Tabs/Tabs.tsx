import { ComponentPropsWithoutRef } from "react";
import { PropsWithoutRef } from "react";
import styled from "styled-components";
import { TabReactElement } from "./Tab";

export type TabsProps = {
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
    background: none;
    border: none;
    padding: 5px 15px;
    border-bottom: ${props => props.active ? '2px solid #0c6947' : 'none'};
    margin-bottom: ${props => props.active ? '0' : '2'}px; 
`;

export const Tabs: React.FC<TabsProps> = ({
    activeTabId,
    onTabChange,
    children
}) => {
    const tabChildren = children as TabReactElement[];
    try {
        (tabChildren as TabReactElement[]).forEach(child => {
            if (child.type.name !== 'Tab') {
                throw new Error();
            }
        });
    } catch (e) {
        throw new Error('Tabs component should have only Tab components as childs');
    }

    const headerItems = tabChildren.map(({ props: childProps }, index) => (
        <TabItem key={index}>
            <TabItemButton active={childProps.id === activeTabId} onClick={() => onTabChange(childProps.id)}>
                {childProps.header}
            </TabItemButton>
        </TabItem>
    ));

    return (
        <div>
            <ul className="flex justify-start items-center">
                {headerItems}
            </ul>
            <div>
                {tabChildren.find(child => child.props.id === activeTabId)?.props.children}
            </div>
        </div>
    )
}