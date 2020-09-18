/**
 * @version 0.9
 */
import DBInterface from '../DB/DBInterface'
import Log from '../../../services/Log/Log'

import walletDS from '../Wallet/Wallet'

const tableName = 'app_news'

class AppNews {

    /**
     * @param {string} appNews.id
     * @param {string} appNews.newsName
     */
    setRemoved = async (appNews) => {
        const dbInterface = new DBInterface()
        const now = Math.round(new Date().getTime() / 1000)
        let sql
        if (typeof appNews.id !== 'undefined') {
            sql = `UPDATE app_news SET news_removed=${now} WHERE id=${appNews.id}`
        } else {
            sql = `UPDATE app_news SET news_removed=${now} WHERE news_name='${appNews.newsName}'`
        }
        await dbInterface.setQueryString(sql).query()
    }

    /**
     * @param {number} appNewsId
     * @param {number} appNewsNewsNeedPopup
     */
    setNewsNeedPopup = async (appNewsId, appNewsNewsNeedPopup) => {
        const dbInterface = new DBInterface()
        const sql = `UPDATE app_news SET news_need_popup=${appNewsNewsNeedPopup} WHERE id=${appNewsId}`
        await dbInterface.setQueryString(sql).query()
    }

    /**
     * @param {string} appNews.walletHash
     * @param {string} appNews.currencyCode
     * @param {string} appNews.newsGroup
     * @param {string} appNews.newsName
     * @param {string} appNews.newsJson
     * @param {string} appNews.newsCustomCreated
     * @param {string} appNews.newsUniqueKey
     * @param {boolean} appNews.onlyOne
     */
    saveAppNews = async (appNews) => {
        const dbInterface = new DBInterface()
        const now = Math.round(new Date().getTime() / 1000)
        if (typeof appNews.newsJson !== 'undefined' && appNews.newsJson) {
            if (typeof appNews.newsJson !== 'string') {
                appNews.newsJson = dbInterface.escapeString(JSON.stringify(appNews.newsJson))
            }
        }
        if (typeof appNews.newsCustomCreated === 'undefined') {
            appNews.newsCustomCreated = now
        }
        appNews.newsCreated = now
        if (typeof appNews.onlyOne !== 'undefined') {
            let sql = `DELETE FROM app_news WHERE currency_code='${appNews.currencyCode}' AND news_name='${appNews.newsName}'`
            if (typeof appNews.walletHash !== 'undefined') {
                sql += ` AND wallet_hash='${appNews.walletHash}'`
            }
            await dbInterface.setQueryString(sql).query()
            delete appNews.onlyOne
        }
        if (typeof appNews.newsUniqueKey !== 'undefined' && appNews.newsUniqueKey) {
            let sql = `DELETE FROM app_news WHERE currency_code='${appNews.currencyCode}' AND news_unique_key='${appNews.newsUniqueKey}'`
            if (typeof appNews.walletHash !== 'undefined') {
                sql += ` AND wallet_hash='${appNews.walletHash}'`
            }
            await dbInterface.setQueryString(sql).query()
        }
        await dbInterface.setTableName(tableName).setInsertData({ insertObjs: [appNews] }).insert()
    }

    clear = async() => {
        const dbInterface = new DBInterface()
        await dbInterface.setQueryString('UPDATE ' + tableName + ' SET news_removed=1 WHERE news_removed IS NULL').query()
    }

    shownPopup = async (id) => {
        if (typeof id === 'undefined' || !id) return
        const dbInterface = new DBInterface()
        await dbInterface.setQueryString('UPDATE ' + tableName + ' SET news_shown_popup=1 WHERE id=' + id).query()
    }

    /**
     * @param {string} params.walletHash
     * @param {string} params.newsServerId
     * @param {string} params.newsNeedPopup
     * @param {string} params.limit
     */
    getAppNews = async (params) => {
        const dbInterface = new DBInterface()

        const wallets = await walletDS.getWallets()
        const names = {}
        let useNames = false
        if (wallets) {
            if (wallets.length > 1) {
                useNames = true
            }
            let wallet
            for(wallet of wallets) {
                names[wallet.walletHash] = wallet.walletName
            }
        }

        let where = [`app_news.news_removed IS NULL`]

        if (params && params.walletHash) {
            where.push(`app_news.wallet_hash='${params.walletHash}'`)
        }
        if (params && params.newsNeedPopup) {
            where.push(`app_news.news_need_popup=${params.newsNeedPopup}`)
            where.push(`app_news.news_shown_popup IS NULL`)
        }
        if (params && typeof params.newsServerId !== 'undefined') {
            where.push(`app_news.news_server_id > 0`)
        }

        if (where.length > 0) {
            where = ' WHERE ' + where.join(' AND ')
        } else {
            where = ''
        }

        let limit = 100
        if (params && typeof params.limit !== 'undefined' && params.limit > 0) {
            limit = params.limit
        }

        const sql = ` 
            SELECT
                app_news.id,
                app_news.wallet_hash AS walletHash,
                app_news.currency_code AS currencyCode,
                app_news.news_source AS newsSource,
                app_news.news_group AS newsGroup,
                app_news.news_priority AS newsPriority,
                app_news.news_name AS newsName,
                app_news.news_json AS newsJson,
                app_news.news_custom_title AS newsCustomTitle,
                app_news.news_custom_text AS newsCustomText,
                app_news.news_custom_created AS newsCreated,          
                app_news.news_status AS newsStatus,  
                app_news.news_need_popup AS newsNeedPopup,              
                app_news.news_shown_popup AS newsShownPopup,
                app_news.news_shown_list AS newsShownList,
                app_news.news_server_id AS newsServerId
            FROM app_news
            ${where}
            ORDER BY app_news.news_priority, app_news.news_custom_created DESC, app_news.id DESC
            LIMIT ${limit}
        `

        let res = []
        try {
            res = await dbInterface.setQueryString(sql).query()
            if (!res || typeof res.array === 'undefined' || !res.array || !res.array.length) {
                Log.daemon('AppNews getAppNews finished as empty')
                return false
            }
            res = res.array
            for (let i = 0, ic = res.length; i < ic; i++) {
                if (useNames && typeof names[res[i].walletHash] !== 'undefined') {
                    res[i].walletName = names[res[i].walletHash]
                } else {
                    res[i].walletName = ''
                }
                if (!res[i].newsJson || res[i].newsJson === 'false') continue

                const string = dbInterface.unEscapeString(res[i].newsJson)
                try {
                    res[i].newsJson = JSON.parse(string)
                } catch (e) {
                    // noinspection ES6MissingAwait
                    Log.errDaemon('DS/AppNews getAppNews json error ' + string + ' ' + e.message)
                }
            }
        } catch (e) {
            Log.errDaemon('DS/AppNews getAppNews error ' + sql + ' ' + e.message)
        }
        return res
    }
}

export default new AppNews()
