import { useEffect, useState } from "react"

export const useLoadImageBackground = (src: string | null) => {
    const [loadError, setLoadError] = useState<any | null>(null);
    const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

    useEffect(() => {
        if (src) {
            const img = new Image();
            img.src = src;
            img.onload = () => setLoadedSrc(src);
            img.onerror = (err) => setLoadError(err);
        }
    }, [src])

    const reset = () => {
        setLoadError(null);
        setLoadedSrc(null);
    }

    return [loadError, loadedSrc, reset];
}