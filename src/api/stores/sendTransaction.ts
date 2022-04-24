
import Web3 from "web3";
import { Contract } from "../../types/Contracts";
import { Wei } from "../../types/Wei";

export const sendTransaction = (web3: Web3, tokenContract: Contract, tokenValueWei: Wei, from: string, to: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        web3.eth.sendTransaction({
            from,
            to: tokenContract.options.address,
            value: 0,
            data: tokenContract.methods.transfer(to, tokenValueWei).encodeABI()
        }, (err, hash) => {
            err ? reject(err) : resolve(hash);
        });
    });
}