import { getDecodedToken } from "variables/accessToken";

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
  validUser: true,
  validPass: true,
  loggedOn: false,
  autoComplete: false,
  submitEnabled: false
}

const loginReducer = (state, action) => {
    const { payload, type } = action;
    switch (type) {
      case loginActions.SET_LOGIN_USERNAME:
        return { ...state, username: payload, validUser: (payload.length > 0), submitEnabled: validSubmit({ ...state, username: payload }) }     
      case loginActions.SET_LOGIN_PASSWORD:
        return { ...state, password: payload, validPass: (payload.length > 0), submitEnabled: validSubmit({ ...state, password: payload}) }    
      case loginActions.SET_LOGIN_AUTOCOMPLETE:
        return { ...state, autoComplete: payload }      
      case loginActions.LOGIN:
        const { username, firstName, lastName, orgUnit} = getDecodedToken();
        if (orgUnit === 'Funcionarios') {
          return { ...state, loggedOn: true, username, firstName, lastName, orgUnit }     
        } else {
          return { ...state, loggedOn: false }       
        }
      case loginActions.LOGOFF:
        return { ...state, loggedOn: false }     
      default:
        return state;
    }
  }

  const validSubmit = (state) => {
    if (state.username && state.password) {
      if (state.username.length > 0 && state.password.length > 0) {
        return true
      }
    }
    return false;
  }

export { loginActions, loginReducer, loginInitialState };