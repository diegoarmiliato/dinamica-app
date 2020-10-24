const userActions = {
  SET_USER_USERNAME: 'SET_USER_USERNAME',
  SET_USER_PASSWORD: 'SET_USER_PASSWORD',
  SET_USER_FIRSTNAME: 'SET_USER_FIRSTNAME',
  SET_USER_LASTNAME: 'SET_USER_LASTNAME',
  COLLAPSE_CREATEUSERCARD: 'COLLAPSE_CREATEUSERCARD',
  SET_USER_CREATED: 'SET_USER_CREATED'
}

const userInitialState = {
  username: '1234',
  password: 'sysadmin',
  firstName: 'Diego',
  lastName: 'Armiliato',
  createCard: false,  
  proposeUser: true,
  validUser: true,
  validPass: true,
  validFirst: true,
  validLast: true,
  submitEnabled: false
}

const userReducer = (state, action) => {
  switch (action.type) {
    case userActions.SET_USER_USERNAME:
      return { ...state, username: action.payload, validUser: (action.payload.length > 0), submitEnabled: validSubmit({ ...state, username: action.payload }) }
    case userActions.SET_USER_PASSWORD:
      return { ...state, password: action.payload, validPass: (action.payload.length > 0), submitEnabled: validSubmit({ ...state, password: action.payload }) }
    case userActions.SET_USER_FIRSTNAME:
      return { ...state, firstName: action.payload, validFirst: (action.payload.length > 0), submitEnabled: validSubmit({ ...state, firstName: action.payload }) }
    case userActions.SET_USER_LASTNAME:
      return { ...state, lastName: action.payload, validLast: (action.payload.length > 0), submitEnabled: validSubmit({ ...state, lastName: action.payload }) }
    case userActions.COLLAPSE_CREATEUSERCARD:
      return { ...state, createCard: !state.createCard }
    case userActions.SET_USER_CREATED:
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

export { userActions, userReducer, userInitialState };