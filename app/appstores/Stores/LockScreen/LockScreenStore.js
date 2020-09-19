/**
 * @version 0.9
 */
const INITIAL_STATE = {
    flowType: '',
    actionCallback: () => {}
}

const lockScreenReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_LOCK_SCREEN_FLOW_TYPE':
            return {
                ...state,
                flowType: action.flowType
            }
        case 'SET_ACTION_CALLBACK':
            return {
                ...state,
                actionCallback: action.actionCallback
            }
        default:
            break
    }

    return state
}

export default lockScreenReducer
