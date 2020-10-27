const userCreateActions = {
  SET_CREATEUSE_USERNAME: 'SET_CREATEUSE_USERNAME',
  SET_CREATEUSE_PASSWORD: 'SET_CREATEUSE_PASSWORD',
  SET_CREATEUSE_FIRSTNAME: 'SET_CREATEUSE_FIRSTNAME',
  SET_CREATEUSE_LASTNAME: 'SET_CREATEUSE_LASTNAME',
  COLLAPSE_CREATEUSE_RCARD: 'COLLAPSE_CREATEUSERCARD',
  SET_USER_CREATED: 'SET_USER_CREATED'
}

const userCreateInitialState = {
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  createCard: false,  
  proposeUser: true,
  validUser: true,
  validPass: true,
  validFirst: true,
  validLast: true,
  submitEnabled: false
}

const userCreateReducer = (state, action) => {
  switch (action.type) {
    case userCreateActions.SET_CREATEUSE_USERNAME:
      return { ...state, username: action.payload, validUser: (action.payload.length > 0), submitEnabled: validSubmit({ ...state, username: action.payload }) }
    case userCreateActions.SET_CREATEUSE_PASSWORD:
      return { ...state, password: action.payload, validPass: (action.payload.length > 0), submitEnabled: validSubmit({ ...state, password: action.payload }) }
    case userCreateActions.SET_CREATEUSE_FIRSTNAME:
      return { ...state, firstName: action.payload, validFirst: (action.payload.length > 0), submitEnabled: validSubmit({ ...state, firstName: action.payload }) }
    case userCreateActions.SET_CREATEUSE_LASTNAME:
      return { ...state, lastName: action.payload, validLast: (action.payload.length > 0), submitEnabled: validSubmit({ ...state, lastName: action.payload }) }
    case userCreateActions.COLLAPSE_CREATEUSERCARD:
      return { ...state, createCard: !state.createCard }
    case userCreateActions.SET_USER_CREATED:
      return { ...state, username: '', password: '', firstName: '', lastName: '', submitEnabled: validSubmit({ ...state, username: ''}) }
    default:
      return state;
  }
}

const validSubmit = (state) => {
  if (state.validUser && state.validPass && state.validFirst && state.validLast) {
    if (state.username.length > 0 && state.password.length > 0 && state.firstName.length > 0 && state.lastName.length > 0) {
      return true
    }
  }
  return false;
}

export { userCreateActions, userCreateReducer, userCreateInitialState };