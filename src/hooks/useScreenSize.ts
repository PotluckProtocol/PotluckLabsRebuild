import { useState, useEffect } from 'react';
import throttle from 'lodash/throttle';

const getScreenSize = (width: number): 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' => {
    if (width < 640) {
        return 'xs';
    } else if (width < 768) {
        return 'sm';
    } else if (width < 1024) {
        return 'md';
    } else if (width < 1280) {
        return 'lg';
    } else if (width < 1536) {
        return 'xl';
    } else {
        return '2xl';
    }
};

const useScreenSize = () => {
    const [screenSize, setScreenSize] = useState(() => getScreenSize(window.innerWidth));

    useEffect(() => {
        const calcInnerWidth = throttle(function () {
            setScreenSize(getScreenSize(window.innerWidth))
        }, 200);
        window.addEventListener('resize', calcInnerWidth);
        return () => window.removeEventListener('resize', calcInnerWidth);
    }, []);

    return screenSize;
}

export default useScreenSize;