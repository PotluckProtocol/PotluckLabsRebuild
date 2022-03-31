import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const StyledListItem = styled.li`
    display: block;

    a:hover:not(:active) {
        background-color: #071f16 !important;
    }
`;

export type MenuItemProps = {
    path: string;
    onNavigate?: () => void
}

export const MenuItem: React.FC<MenuItemProps> = (props) => {

    const styleInject = (props: { isActive: boolean }): React.CSSProperties => ({
        display: 'block',
        padding: '10px 12px',
        backgroundColor: props.isActive ? '#0c6947' : 'transparent',
    });

    let content: ReactNode;
    if (props.path.startsWith('https://') || props.path.startsWith('http://')) {
        content = (
            <a href={props.path} target="_blank" style={styleInject({ isActive: false })} className="rounded-md">
                {props.children}
            </a>
        )
    } else {
        content = (
            <NavLink to={props.path} style={styleInject} onClick={props.onNavigate} className="rounded-md">
                {props.children}
            </NavLink>
        );
    }


    return (
        <StyledListItem role="listitem">
            {content}
        </StyledListItem>
    );
}