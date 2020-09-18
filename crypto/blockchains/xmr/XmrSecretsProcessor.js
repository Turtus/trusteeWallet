/**
 * @version 0.11
 * https://coinomi.github.io/bip39-monero/
 */
import BlocksoftKeys from '../../actions/BlocksoftKeys/BlocksoftKeys'

import { soliditySha3 } from 'web3-utils'
import MoneroUtils from './ext/MoneroUtils'
import MoneroMnemonic from './ext/MoneroMnemonic'

const bip32 = require('bip32')
const bitcoin = require('bitcoinjs-lib')
const networksConstants = require('../../common/ext/networks-constants')

const BTC = networksConstants['mainnet'].network

export default class XmrSecretsProcessor {

    /**
     * @param {string} data.mnemonic
     */
    async getWords(data) {
        const seed = BlocksoftKeys.getSeedCached(data.mnemonic)
        const root = bip32.fromSeed(seed)
        const child = root.derivePath('m/44\'/128\'/0\'/0/0')
        const keyPair = bitcoin.ECPair.fromPrivateKey(child.privateKey, { network: BTC })
        const rawPrivateKey = keyPair.privateKey
        const rawSecretSpendKey = soliditySha3(rawPrivateKey)
        const rawSecretSpendKeyBuffer = Buffer.from(rawSecretSpendKey.substr(2), 'hex')

        const secretSpendKey = MoneroUtils.sc_reduce32(rawSecretSpendKeyBuffer)

        const secretViewKey = MoneroUtils.hash_to_scalar(secretSpendKey)

        const words = MoneroMnemonic.secret_spend_key_to_words(secretSpendKey)

        const publicSpendKey = MoneroUtils.secret_key_to_public_key(secretSpendKey)

        const publicViewKey = MoneroUtils.secret_key_to_public_key(secretViewKey)

        const address = MoneroUtils.pub_keys_to_address(0, publicSpendKey, publicViewKey)


        /*console.log({
            secretSpendKey,
            secretViewKey,
            words,
            publicViewKey: publicViewKey.toString('hex'),
            publicSpendKey: publicSpendKey.toString('hex'),
            address
        })*/

        return words
    }
}
