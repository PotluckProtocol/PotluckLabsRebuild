import textfit from 'textfit';
import { useRef, useEffect } from "react";
import styled from 'styled-components';

export type TextFitProps = {
    height?: number
    className?: string;
}

const Container = styled.div`
    width: 100%;

    span {
        line-height: 100%;
    }
`;

export const TextFit: React.FC<TextFitProps> = ({ height, children, className }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timeouts: Array<ReturnType<typeof setTimeout>> = [];

        if (ref.current) {
            const fit = () => {
                textfit(ref.current as HTMLElement, { multiLine: true });
            }

            // Really ugly hack
            // Call fit 3 times:
            // - Firstly immediately,
            // - Secondly immediately in on next async tick
            // - Thridly after 100ms async
            // to be sure that fitting is done. 
            fit();
            timeouts.push(
                setTimeout(fit, 0),
                setTimeout(fit, 100),
                setTimeout(fit, 500)
            );
        }

        return () => {
            timeouts.forEach(timer => clearTimeout(timer));
        }

    }, [children, ref, height]);

    return (
        <Container className={className} ref={ref} style={{ height }}>
            {children}
        </Container>
    );
}