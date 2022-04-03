import { useEffect, useState } from "react"

export const useImageWidth = (imageSrc: string | null, inContainerOfHeight: number) => {
    const [imageWidth, setImageWidth] = useState<number | null>(null);

    useEffect(() => {
        if (imageSrc !== null) {

            const element = window.document.createElement('div');
            element.style.position = 'absolute';
            element.style.left = '-9999px';
            element.style.height = `${inContainerOfHeight}px`;

            const img = window.document.createElement('img');
            img.style.height = '100%';
            img.src = imageSrc;


            element.appendChild(img);

            window.document.body.append(element);

            if (img.complete) {
                setImageWidth(img.clientWidth);
                window.document.body.removeChild(element);
            } else {
                img.addEventListener('load', () => {
                    setImageWidth(img.clientWidth);
                    window.document.body.removeChild(element);
                });
            }
        }

    }, [imageSrc, inContainerOfHeight])

    return imageWidth;
}