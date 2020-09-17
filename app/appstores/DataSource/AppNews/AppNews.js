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
     */
    setRemoved = async (appNews) => {
        const dbInterface = new DBInterface()
        const now = Math.round(new Date().getTime() / 1000)
        const sql = `UPDATE app_news SET news_removed=${now} WHERE id=${appNews.id}`
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
     * @param {string} params.newsNeedPopup
     */
    getAppNews = async (params) => {
        const dbInterface = new DBInterface()

        Log.daemon('AppNews getAppNews called')

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

        if (where.length > 0) {
            where = ' WHERE ' + where.join(' AND ')
        } else {
            where = ''
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
            LIMIT 100
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
                if (!res[i].newsJson || res[i].newsJson === 'false') continue

                const string = dbInterface.unEscapeString(res[i].newsJson)
                try {
                    res[i].newsJson = JSON.parse(string)
                } catch (e) {
                    // noinspection ES6MissingAwait
                    Log.errDaemon('AppNews getAppNews json error ' + string + ' ' + e.message)
                }

                if (useNames && typeof names[res[i].walletHash] !== 'undefined') {
                    res[i].walletName = names[res[i].walletHash]
                } else {
                    res[i].walletName = ''
                }
            }
            Log.daemon('AppNews getAppNews finished')
        } catch (e) {
            Log.errDaemon('AppNews getAppNews error ' + sql + ' ' + e.message)
        }
        return res
    }
}

export default new AppNews()
