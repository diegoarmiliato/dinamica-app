const loginActions = {
  SET_LOGIN_USERNAME: 'SET_LOGIN_USERNAME',
  SET_LOGIN_PASSWORD: 'SET_LOGIN_PASSWORD',
  SET_LOGIN_AUTOCOMPLETE: 'SET_LOGIN_AUTOCOMPLETE',
  LOGIN: 'LOGIN',
  LOGOFF: 'LOGOFF'
}

const loginInitialState = {
  username: '',
  firstName: '',
  lastName: '',
  password: '',
  loggedOn: false,
  autoComplete: false
}

const loginReducer = (state, action) => {
    switch (action.type) {
      case loginActions.SET_LOGIN_USERNAME:
        return { ...state, username: action.payload }     
      case loginActions.SET_LOGIN_PASSWORD:
        return { ...state, password: action.payload }    
      case loginActions.SET_LOGIN_AUTOCOMPLETE:
        console.log(action);
        return { ...state, autoComplete: action.payload }      
      case loginActions.LOGIN:
        return { ...state, loggedOn: true, ...action.payload }     
      case loginActions.LOGOFF:
        return { ...state, loggedOn: false }     
      default:
        return state;
    }
  }

export { loginActions, loginReducer, loginInitialState };