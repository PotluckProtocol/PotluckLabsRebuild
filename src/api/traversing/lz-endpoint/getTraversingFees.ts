import { BigNumber, ethers, utils } from "ethers";
import { abi as lzEndpointAbi } from "./abi";

export type GetTraversingFeesOpts = {
    tokenId: number;
    currentTokenContractAddress: string;
    endpointContractAddress: string;
    signerOrProvider: ethers.Signer | ethers.providers.Provider;
    targetTraversingChainId: number;
}

const FEE_MULTIPLY_FACTOR = 1.2;

/**
 * Estimates traversing fees by asking them from the layer 0 endpoint contract.
 */
export const getTraversingFees = async (opts: GetTraversingFeesOpts): Promise<BigNumber> => {

    const FEE_GAS_MAX = 350000;
    const VERSION = 1;

    const {
        endpointContractAddress,
        signerOrProvider,
        targetTraversingChainId,
        currentTokenContractAddress,
        tokenId
    } = opts;

    const endpointContract = new ethers.Contract(endpointContractAddress, lzEndpointAbi, signerOrProvider);
    const abiCoder = new utils.AbiCoder();
    const payload = abiCoder.encode(['address', 'uint256'], [currentTokenContractAddress, tokenId]);
    const adapterParams = utils.solidityPack(['uint16', 'uint'], [VERSION, FEE_GAS_MAX]);

    try {
        const [fees] = await endpointContract.estimateFees(
            targetTraversingChainId,
            currentTokenContractAddress,
            payload,
            false,
            adapterParams
        );

        /**
         * Increase fees by multiplying the returned fees FEE_MULTIPLY_FACTOR. This ensures there is
         * enough fees in all circumstances. Non-used fees are returned into calling wallet, so no
         * extra is lost.
         */
        const increasedFee = BigNumber.from(fees).mul(FEE_MULTIPLY_FACTOR);

        return increasedFee;
    } catch (e) {
        console.log('Fetching traversing fees failed', e);
        throw e;
    }
}