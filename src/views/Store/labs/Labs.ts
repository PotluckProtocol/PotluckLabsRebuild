import { Token } from "../../../types/Token"

export const LABS_CONTRACT_ADDRESSES: { [networkId: number]: string } = {
    250: '0x623d0f6a58e563C8627Da26B567269A18555aa52',
    137: '0xBd770416a3345F91E4B34576cb804a576fa48EB1',
    43114: '0xed37405de14e39f72e4a405de32b6b90c96b97e5'
}

export const LABS_TOKEN: Token = {
    decimals: 18,
    symbol: 'LABS'
}