import { BigNumber, ethers } from "ethers";
import EventEmitter from "events";
import { Wei } from "../../types/Wei";

export class ERC20TokenWrapper extends EventEmitter {

    constructor(
        public contract: ethers.Contract
    ) {
        super();
    }

    public async approve(amountWei: BigNumber, spenderAddress: string): Promise<void> {
        const tx = await this.contract.approve(spenderAddress, amountWei);
        await tx.wait();
    }

    public async getAllowance(walletAddress: string, spenderAddress: string): Promise<BigNumber> {
        return this.contract.allowance(walletAddress, spenderAddress);
    }

    public async getSymbol(): Promise<string> {
        try {
            const symbol = await this.contract.symbol();
            return symbol;
        } catch (e) {
            console.log('Error on fetching symbol', e);
            throw e;
        }
    }

    public async getDecimals(): Promise<number> {
        const res = await this.contract.decimals();
        return Number(res);
    }

    public async getBalance(walletAddress: string): Promise<BigNumber> {
        return this.contract.balanceOf(walletAddress);
    }

    public async transfer(to: string, amountWei: string): Promise<void> {
        try {
            const feeData = await this.contract.provider.getFeeData();


            /** We must resolve the fee data ourselves as mobile metamask has 
              * problems sending erc20 tokens without site suggested data.
              * @see https://github.com/MetaMask/metamask-mobile/issues/3999 
              */
            let maxPriorityFeePerGas: BigNumber | undefined;
            let maxFeePerGas: BigNumber | undefined;
            if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
                const halfOfFeePerGas = feeData.maxFeePerGas.div(BigNumber.from(2));
                maxFeePerGas = feeData.maxFeePerGas;
                maxPriorityFeePerGas = halfOfFeePerGas.gt(feeData.maxPriorityFeePerGas)
                    ? halfOfFeePerGas
                    : maxPriorityFeePerGas
            }

            const tx = await this.contract.transfer(to, amountWei, {
                maxFeePerGas,
                maxPriorityFeePerGas
            });

            await tx.wait();
        } catch (e) {
            console.log('Tranfer failed', e);
            throw e;
        }
    }

}