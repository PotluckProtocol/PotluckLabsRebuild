export type Artist = {
    id: string;
    name: string;
    description?: string | string[];
    image?: string;
    social: {
        twitter?: string;
        instagram?: string;
    }
}