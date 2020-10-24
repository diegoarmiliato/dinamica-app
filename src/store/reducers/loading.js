const loadingActions = {
  LOADING_ON: 'LOADING_ON',
  LOADING_OFF: 'LOADING_OFF'
}

const loadingInitialState = {
  loading: true
}
  
const loadingReducer = (state, action) => {
  switch (action.type) {   
    case loadingActions.LOADING_ON:            
      return { ...state, loading: true }     
    case loadingActions.LOADING_OFF:
      return { ...state, loading: false }
    default:
      return state;
  }
}

export { loadingActions, loadingReducer, loadingInitialState }