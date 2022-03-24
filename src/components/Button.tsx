import { ComponentPropsWithoutRef, HTMLProps } from "react";
import styled from "styled-components";
import classNames from 'classnames';

export type ButtonProps = ComponentPropsWithoutRef<'button'> & {
    variant?: 'filled' | 'outlined';
    small?: boolean;
}


// #1bf2a4 #0c6947
type StyledProps = {
    variant: any
}

const StyledButton = styled.button<ButtonProps>`
    height: ${props => props.small ? '26px' : '40px'};
    padding: ${props => props.small ? '0 6px' : '0 12px'};
    background-color: ${props => props.variant === 'outlined' ? 'transparent' : '#1bf2a4'};
    color: ${props => props.variant === 'outlined' ? '#1bf2a4' : 'black'};
    border: ${props => props.variant === 'outlined' ? '2px solid #1bf2a4' : 'none'};
`;


export const Button: React.FC<ButtonProps> = (props) => {
    const classes = classNames(props.className, 'rounded-md')
    return <StyledButton {...props} className={classes} />
}

export default Button;