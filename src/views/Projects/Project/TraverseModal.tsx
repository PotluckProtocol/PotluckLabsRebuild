import { createPortal } from "react-dom";
import styled from "styled-components";
import { RoundedButton } from "../../../components/RoundedButton";

export type ChooseWalletModalProps = {
    onWalletChosen: (walletType: WalletType) => void;
    onClose: () => void;
}

const Shroud = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 100vh;
    z-index: 8999;
    background-color: rgba(0,0,0,0.75);
`;

const Container = styled.div`
    position: absolute;
    border-radius: 1.5rem;
    background: rgba(3,26,18,1);
    background: linear-gradient(0deg,rgba(3,26,18,1) 0%,rgba(12,105,71,1) 100%);
    top: 5rem;
    width: 300px;
    right: 50%;
    transform: translateX(50%);
    box-shadow: rgba(27, 242, 165, 0.2) 1px 1px 10px 1px;
`;

const Title = styled.h2`
    text-align: center;
    font-size: 1.5rem;
    font-weight: 600;
`;

export const ChooseWalletModal: React.FC<ChooseWalletModalProps> = ({
    onClose
}) => {

    const content = (
        <Shroud>
            <Container className="p-4">
                <Title className="mb-4">Traverse between chains</Title>





                <RoundedButton onClick={onClose}>Close</RoundedButton>
            </Container>
        </Shroud>
    )

    return createPortal(content, document.body);

}