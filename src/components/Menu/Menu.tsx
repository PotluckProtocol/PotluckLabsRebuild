import classNames from "classnames";
import styled from "styled-components";

export type MenuProps = {
    open: boolean;
    onClose: () => void;
}

const Container = styled.div`
    position: fixed;
    background-color: black;
    top: 0;
    left: 0;
    padding: 0 .5rem;

    transform: translate3d(-300px, 0, 0);
    height: 100vh;
    width: 230px;
    transition: transform .3s cubic-bezier(0, .52, 0, 1);
    z-index: 9999;
    box-shadow: 4px 0px 20px rgba(12, 105, 71, 0.3);

    &.open {
        transform: translate3d(0, 0, 0);
    }

    @media (min-width: 768px) {
        transform: translate3d(0, 0, 0);
        position: static;
        top: auto;
        left: auto;
        box-shadow: none;
    }
`;

const Shroud = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vh;
    z-index: 9998;
    background: rgba(0,0,0,0.65);
    animation: fadeIn .5s;

    @keyframes fadeIn {
        0% {opacity:0;}
        100% {opacity:1;}
    }

    @media (min-width: 768px) {
        display: none;
    }
`;

export const Menu: React.FC<MenuProps> = ({
    children,
    open,
    onClose
}) => {
    const classes = classNames('pt-1', { open })

    return (
        <>
            <Container className={classes}>
                {children}
            </Container>
            {open && <Shroud onClick={() => onClose()} />}
        </>
    )
}