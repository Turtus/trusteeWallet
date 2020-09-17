/**
 * @version 0.9
 */
const INITIAL_STATE = {
    logged: null,
    authMnemonicHash: ''
}

const authStoreReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_AUTH_STATUS':
            return new Object({
                ...state,
                logged: action.logged
            })
        case 'SET_AUTH_MNEMONIC_HASH':
            return new Object({
                ...state,
                authMnemonicHash: action.authMnemonicHash
            })
        default:
            return state
    }
}

export default authStoreReducer
