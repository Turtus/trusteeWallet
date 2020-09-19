/**
 * @version 0.9
 */
const INITIAL_STATE = {
    flowType: '',
    walletName: '',
    walletMnemonic: '',
    mnemonicLength: 0,
    callback: null
}

const createWalletStoreReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_MNEMONIC_LENGTH':
            return new Object({
                ...state,
                mnemonicLength: action.mnemonicLength
            })
        case 'SET_WALLET_NAME':
            return new Object({
                ...state,
                walletName: action.walletName
            })
        case 'SET_WALLET_MNEMONIC':
            return new Object({
                ...state,
                walletMnemonic: action.walletMnemonic
            })
        case 'CLEAT_INIT_STATE':
            return new Object({
                ...INITIAL_STATE
            })
        case 'SET_FLOW_TYPE':
            return new Object({
                ...state,
                flowType: action.flowType
            })
        case 'SET_CALLBACK':
            return new Object({
                ...state,
                callback: action.callback
            })
        default:
            return state
    }
}

export default createWalletStoreReducer
