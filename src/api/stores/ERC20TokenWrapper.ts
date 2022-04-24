import EventEmitter from "events";
import { Contract } from "../../types/Contracts";
import { Wei } from "../../types/Wei";

export class ERC20TokenWrapper extends EventEmitter {

    constructor(
        public contract: Contract
    ) {
        super();
    }

    public async getDecimals(): Promise<number> {
        const res = await this.contract.methods.decimals().call();
        return Number(res);
    }

    public async balanceOf(address: string): Promise<Wei> {
        const res = await this.contract.methods.balanceOf(address).call();
        return res as Wei;
    }

}