/**
 * @version 0.11
 * https://coinomi.github.io/bip39-monero/
 *
 *
 * let mnemonic = ''
 * let results = await BlocksoftKeys.discoverAddresses({ mnemonic, fullTree: false, fromIndex: 0, toIndex: 1, currencyCode: ['XMR'] })
 * console.log('r', results['XMR'][0])
 */
import MoneroUtils from './ext/MoneroUtils'
import MoneroMnemonic from './ext/MoneroMnemonic'
import { soliditySha3 } from 'web3-utils'
import BlocksoftAxios from '../../common/BlocksoftAxios'
import BlocksoftCryptoLog from '../../common/BlocksoftCryptoLog'

const bitcoin = require('bitcoinjs-lib')
const networksConstants = require('../../common/ext/networks-constants')

const BTC = networksConstants['mainnet'].network


export default class XmrAddressProcessor {

    _root = false

    async setBasicRoot(root) {
        this._root = root
    }


    /**
     * @param {string|Buffer} privateKey
     * @param {*} data.publicKey
     * @param {*} data.walletHash
     * @param {*} data.derivationPath
     * @param {*} data.derivationIndex
     * @param {*} data.derivationType
     * @returns {Promise<{privateKey: string, address: string, addedData: *}>}
     */
    async getAddress(privateKey, data = {}) {
        if (typeof data.derivationType !== 'undefined' && data.derivationType && data.derivationType !== 'main') {
            return false
        }
        if (typeof data.derivationIndex === 'undefined' || !data.derivationIndex || data.derivationIndex === 0) {
            const child = this._root.derivePath('m/44\'/128\'/0\'/0/0')
            privateKey = child.privateKey
        } else {
            privateKey = Buffer.from(privateKey)
        }
        const keyPair = bitcoin.ECPair.fromPrivateKey(privateKey, { network: BTC })
        const rawPrivateKey = keyPair.privateKey
        const rawSecretSpendKey = soliditySha3(rawPrivateKey)
        const rawSecretSpendKeyBuffer = Buffer.from(rawSecretSpendKey.substr(2), 'hex')

        const secretSpendKey = MoneroUtils.sc_reduce32(rawSecretSpendKeyBuffer)

        const secretViewKey = MoneroUtils.hash_to_scalar(secretSpendKey)

        const words = MoneroMnemonic.secret_spend_key_to_words(MoneroUtils.normString(secretSpendKey), typeof data.walletHash !== 'undefined' ? data.walletHash : 'none')

        const publicSpendKey = MoneroUtils.secret_key_to_public_key(secretSpendKey)

        const publicViewKey = MoneroUtils.secret_key_to_public_key(secretViewKey)

        const address = MoneroUtils.pub_keys_to_address(0, publicSpendKey, publicViewKey)


        let mymoneroError = 0
        try {
            const linkParamsLogin = {
                address: address,
                view_key: MoneroUtils.normString(secretViewKey.toString('hex')),
                create_account: true,
                generated_locally: true
            }
            const resLogin = await BlocksoftAxios.post('https://api.mymonero.com:8443/login', linkParamsLogin)
            if (typeof resLogin.data === 'undefined' || !resLogin.data) {
                throw new Error('no data')
            }
        } catch (e) {
            BlocksoftCryptoLog.log('XmrAddressProcessor mymonero error ' + e.message)
            mymoneroError = 1
        }

        /*
        console.log({
            derivationPath : data.derivationPath,
            secretSpendKey,
            ss : Buffer.from(secretSpendKey, 'hex'),
            secretViewKey,
            sv : Buffer.from(secretViewKey, 'hex'),
            words,
            publicViewKey: publicViewKey.toString('hex'),
            publicSpendKey: publicSpendKey.toString('hex'),
            address
        })
        */

        return {
            address: address,
            privateKey: MoneroUtils.normString(secretSpendKey.toString('hex')) + '_' + MoneroUtils.normString(secretViewKey.toString('hex')),
            addedData: {
                publicViewKey: MoneroUtils.normString(publicViewKey.toString('hex')),
                publicSpendKey: MoneroUtils.normString(publicSpendKey.toString('hex')),
                derivationIndex: 0,
                mymoneroError
            }
        }
    }
}
