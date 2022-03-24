import styled from "styled-components";

const StyledList = styled.ul({

});

export const MenuItemList: React.FC = (props) => {
    return (
        <StyledList role="list">
            {props.children}
        </StyledList>
    )
}