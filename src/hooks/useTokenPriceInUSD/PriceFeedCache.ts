export class PriceFeedCache {

    private cache: { [key: string]: { value: number, expiresIn: number } } = {}

    constructor(
        private expireAfterMs: number
    ) { }

    public get(ident: string): number | null {
        const item = this.cache[ident];
        if (item) {
            if (item.expiresIn < Date.now()) {
                return item.value;
            }
        }
        return null;
    }

    public add(ident: string, value: number): void {
        const expiresIn = Date.now() + this.expireAfterMs;
        this.cache[ident] = { value, expiresIn };
    }

}