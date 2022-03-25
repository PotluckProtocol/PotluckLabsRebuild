import styled from "styled-components";

export const RoundedButton = styled.button`
    font-weight: 900;
    background-color: #1bf2a4;
    border-radius: 2rem;
    color: black;
    padding: 0 20px;
    margin-bottom: 10px;

    :disabled {
        cursor: not-allowed;
        background-color: #869e95;
        color: #60746d;
    }
`;