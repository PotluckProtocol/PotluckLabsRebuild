import styled from "styled-components";

export type AmountSelectorProps = {
    onAmountChange: (amount: number) => void;
    min?: number;
    max?: number;
    value: number;
}

const Container = styled.div`
    display: inline-block;
    border-radius: 1rem;
    height: 35px;
    width: 200px;
    background-color: white;
`;

const Button = styled.button`
    background: none;
    border: none;
    padding: 6px 13px;
    font-size: 1.5rem;
    line-height: 1.5rem;
    color: black;
`;

const Amount = styled.div`
    color: black;
`;

export const AmountSelector: React.FC<AmountSelectorProps> = ({
    onAmountChange,
    max,
    min,
    value
}) => {

    const handleIncrease = () => {
        let newValue = value + 1;
        if (typeof max === 'number' && newValue > max) {
            newValue = max;
        }
        onAmountChange(newValue);
    }

    const handleDecrease = () => {
        let newValue = value - 1;
        if (typeof min === 'number' && newValue < min) {
            newValue = min;
        }
        onAmountChange(newValue);
    }

    return (
        <Container>
            <div className="flex justify-between items-center">
                <Button onClick={handleDecrease}>-</Button>
                <Amount>{value} / {max}</Amount>
                <Button onClick={handleIncrease}>+</Button>
            </div>
        </Container>
    )


} 