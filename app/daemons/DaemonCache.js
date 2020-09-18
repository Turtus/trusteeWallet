/**
 * @version 0.11
 */
import DBInterface from '../appstores/DataSource/DB/DBInterface'

import BlocksoftFixBalance from '../../crypto/common/BlocksoftFixBalance'

class DaemonCache {

    CACHE_WALLET_SUMS = {}
    CACHE_WALLET_TOTAL = { balance: 0, unconfirmed: 0 }
    CACHE_RATES = {}
    CACHE_ALL_ACCOUNTS = {}
    CACHE_WALLET_NAMES_AND_CB = {}

    /**
     * @param walletHash
     * @returns {{unconfirmed: number, balance: number, basicCurrencySymbol: string}}
     */
    getCache(walletHash = false) {
        if (!walletHash) {
            return this.CACHE_WALLET_TOTAL
        }
        if (typeof this.CACHE_WALLET_SUMS[walletHash] === 'undefined') return false
        return this.CACHE_WALLET_SUMS[walletHash]
    }

    /**
     * @param {string} currencyCode
     * @returns {{basicCurrencySymbol: string, basicCurrencyRate: number}}
     */
    getCacheRates(currencyCode) {
        if (typeof this.CACHE_RATES[currencyCode] === 'undefined') {
            return { basicCurrencySymbol: '', basicCurrencyRate: '' }
        }
        return this.CACHE_RATES[currencyCode]
    }

    async _getFromDB(walletHash, currencyCode) {
        const dbInterface = new DBInterface()
        const sql = ` SELECT balance_fix AS balanceFix, balance_txt AS balanceTxt FROM account_balance   WHERE currency_code='${currencyCode}' AND wallet_hash='${walletHash}'`
        const res = await dbInterface.setQueryString(sql).query()
        if (!res || !res.array || res.array.length === 0) {
            return {balance : 0}
        }
        let account
        let totalBalance = 0
        for (account of res.array) {
            const balance = BlocksoftFixBalance(account, 'balance')
            if (balance > 0) {
                totalBalance += balance
            }
        }
        return {balance : totalBalance}
    }

    async getCacheAccount(walletHash, currencyCode) {
        if (typeof this.CACHE_ALL_ACCOUNTS[walletHash] === 'undefined') {
            return this._getFromDB(walletHash, currencyCode)
        }
        if (typeof this.CACHE_ALL_ACCOUNTS[walletHash][currencyCode] === 'undefined') {
            return this._getFromDB(walletHash, currencyCode)
        }
        return this.CACHE_ALL_ACCOUNTS[walletHash][currencyCode]
    }
}

const single = new DaemonCache()
export default single
