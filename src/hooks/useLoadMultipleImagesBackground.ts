import { useEffect, useState } from "react"


const loadImage = (src: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(src);
        img.onerror = (err) => reject(err);
    });
}

export const useLoadMultipleImagesBackground = (srcs: string[]) => {
    const [loadedSrcs, setLoadedSrcs] = useState<string[] | null>(null);

    useEffect(() => {
        const loadImages = async () => {
            const promises: Promise<string | Error>[] = srcs.map(src => loadImage(src).catch(e => e as Error))
            const results = await Promise.all(promises);
            const nonFailedSrcs = results.filter(result => !(result instanceof Error));

            setLoadedSrcs(nonFailedSrcs as string[]);
        }

        loadImages()
    }, [srcs])

    return loadedSrcs;
}