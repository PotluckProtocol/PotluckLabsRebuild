import { ethers } from "ethers";
import EventEmitter from "events";
import { Wei } from "../../types/Wei";

export class ERC20TokenWrapper extends EventEmitter {

    constructor(
        public contract: ethers.Contract
    ) {
        super();
    }

    public async getDecimals(): Promise<number> {
        const res = await this.contract.decimals();
        return Number(res);
    }

    public async balanceOf(address: string): Promise<Wei> {
        const res = await this.contract.balanceOf(address);
        return res as Wei;
    }

    public async transfer(to: string, amountWei: string): Promise<void> {
        try {
            const tx = await this.contract.transfer(to, amountWei);
            await tx.wait();
        } catch (e) {
            console.log('Tranfer failed', e);
            throw e;
        }
    }

}