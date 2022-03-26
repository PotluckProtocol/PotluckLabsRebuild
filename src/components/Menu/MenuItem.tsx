import { NavLink } from "react-router-dom";
import styled from "styled-components";

const StyledListItem = styled.li`
    display: block;
`;

export type MenuItemProps = {
    path: string;
    onNavigate?: () => void
}

export const MenuItem: React.FC<MenuItemProps> = (props) => {

    const styleInject = (props: { isActive: boolean }): React.CSSProperties => {
        return {
            display: 'block',
            padding: '10px 12px',
            backgroundColor: props.isActive ? '#0c6947' : 'transparent'
        }
    }

    return (
        <StyledListItem role="listitem">
            <NavLink to={props.path} style={styleInject} onClick={props.onNavigate} className="rounded-md">
                {props.children}
            </NavLink>
        </StyledListItem>
    )
}