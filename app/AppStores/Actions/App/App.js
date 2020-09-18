/**
 * @version 0.9
 */
import '../../../services/GlobalExceptionHandler/GlobalExceptionHandler'
import { Text } from 'react-native'

import Orientation from 'react-native-orientation'

import store from '../../../store'

import walletDS from '../../DataSource/Wallet/Wallet'

import NavStore from '../../../components/navigation/NavStore'

import { setInitState, setInitError, setSelectedWallet } from '../../Stores/Main/MainStoreActions'
import { setCards } from '../../Stores/Card/CardActions'
import walletActions from '../../Stores/Wallet/WalletActions'
import currencyActions from '../../Stores/Currency/CurrencyActions'
import settingsActions from '../../Stores/Settings/SettingsActions'
import customCurrencyActions from '../CustomCurrencyActions'
import exchangeActions from '../../Stores/Exchange/ExchangeActions'

import DBOpen from '../../DataSource/DB/DBOpen'
import DBInit from '../../DataSource/DB/DBInit/DBInit'

import Log from '../../../services/Log/Log'
import AppLockScreenIdleTime from '../../../services/AppLockScreenIdleTime/AppLockScreenIdleTime'
import AppVersionControl from '../../../services/AppVersionControl/AppVersionControl'
import AppNotification from '../../../services/AppNotification/AppNotificationListener'

import Daemon from '../../../daemons/Daemon'
import UpdateTradeOrdersDaemon from '../../../daemons/back/UpdateTradeOrdersDaemon'
import CashBackActions from '../../Stores/CashBack/CashBackActions'
import CashBackSettings from '../../Stores/CashBack/CashBackSettings'
import CashBackUtils from '../../Stores/CashBack/CashBackUtils'

import FilePermissions from '../../../services/FileSystem/FilePermissions'

const { dispatch, getState } = store

if (Text.defaultProps == null) Text.defaultProps = {}
Text.defaultProps.allowFontScaling = false


class App {

    initStatus = 'init started'
    initError = 'empty'

    init = async (params) => {
        const navigateToInit = typeof params.navigateToInit !== 'undefined' ? params.navigateToInit : true
        const source = typeof params.source !== 'undefined' ? params.source : ''
        try {
            // console.log(new Date().toISOString() + ' start ' + source)

            await FilePermissions.init()

            this.initStatus = 'FilePermissions.init'

            AppNotification.init()

            Orientation.lockToPortrait()

            const { init } = getState().mainStore

            if (init === true) {
                dispatch(setInitState(true))
                return
            }

            this.initStatus = 'Orientation.lockToPortrait()'

            Log.log('ACT/App init application called ' + source)

            if (navigateToInit) {

                await DBOpen.open()

                this.initStatus = 'await DBOpen.open()'

                await DBInit.init()

                this.initStatus = 'await DBInit.init()'

                if (!(await walletDS.hasWallet())) {

                    this.initStatus = '!(await walletDS.hasWallet())'

                    Log.log('ACT/App no wallets found')

                    NavStore.reset('WalletCreateScreen')

                    this.initStatus = 'NavStore.reset(\'WalletCreateScreen\')'

                    return
                }

                NavStore.reset('InitScreen')

                this.initStatus = 'NavStore.reset(\'InitScreen\')'

                return
            }

            await customCurrencyActions.importCustomCurrenciesToDict()

            this.initStatus = 'await customCurrencyActions.importCustomCurrenciesToDict()'

            await settingsActions.getSettings()

            this.initStatus = 'await settingsActions.getSettings()'

            await this.refreshWalletsStore({firstTimeCall : true, source : 'ACT/App init '})

            this.initStatus = 'await this.refreshWalletsStore(true)'

            exchangeActions.init()

            this.initStatus = 'await ExchangeActions.init()'

            dispatch(setInitState(true))

            this.initStatus = 'dispatch(setInitState(true))'

            Log.log('ACT/App init application finished')

            this.initStatus = 'const { daemon } = config'

            Daemon.start()

            this.initStatus = 'updateTradeOrdersDaemon.fromDB'

            await UpdateTradeOrdersDaemon.fromDB()

            this.initStatus = 'AppLockScreenIdleTime.init'

            AppLockScreenIdleTime.init()

            this.initStatus = 'AppLockScreenIdleTime.init()'

            // noinspection ES6MissingAwait
            setCards()

            this.initStatus = 'setCards()'

            // console.log(new Date().toISOString() + ' done')

        } catch (e) {
            Log.err('ACT/App init application error ' + this.initStatus + ' ' + e.message)
            this.initError = e.message
            dispatch(setInitError(e.message))
            NavStore.goNext('ErrorScreen', {error : e.message})
        }
        try {
            // noinspection ES6MissingAwait
            AppVersionControl.init()
        } catch (e) {
            // do nothing
        }
    }

    /**
     *
     * @param params.firstTimeCall
     * @param params.source
     * @param params.walletHash
     * @returns {Promise<void>}
     */
    refreshWalletsStore = async (params) => {

        const firstTimeCall = typeof params.firstTimeCall !== 'undefined' ? params.firstTimeCall : false
        const source =  typeof params.source !== 'undefined' ? params.source : ''

        Log.log('ACT/App appRefreshWalletsStates called from ' + source)

        await walletActions.setAvailableWallets()

        await setSelectedWallet('ACT/App appRefreshWalletsStates called from ' + source)

        await currencyActions.init()

        await Daemon.forceAll(params)

        await CashBackSettings.init()

        if (firstTimeCall) {
            Log.log('ACT/App refreshWalletsStore CashBack.init ' + (firstTimeCall ? ' first time ' : ''))

            await CashBackUtils.init()

            await CashBackActions.setPublicLink()
        }

        Log.log('ACT/App refreshWalletsStore finished')

    }

}

export default new App()
