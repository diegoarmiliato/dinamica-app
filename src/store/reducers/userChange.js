const userChangeActions = {
  SET_USERLIST_NEWPASSWORD: 'SET_USERLIST_NEWPASSWORD',
  SET_USERLIST_PASSWORDPOPUP: 'SET_USERLIST_PASSWORDPOPUP'
}

const userChangeInitialState = {
  changePassModal: false,
  username: '',
  newPassword: '',
  validNewPassword: true,
  submitEnabled: false
}

const userChangeReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case userChangeActions.SET_USERLIST_PASSWORDPOPUP:
      return { ...state, changePassModal: !state.changePassModal, newPassword: '', username: payload}
    case userChangeActions.SET_USERLIST_NEWPASSWORD:
      return { ...state, newPassword: payload, validNewPassword: (payload.length > 0), submitEnabled: validSubmit(payload, state.username)}
    default:
      return state;
  }
}

const validSubmit = (newPassword, username) => {   
  if (newPassword.length > 0 && username.length > 0) {
    return true
  }
  return false;
}

export { userChangeActions, userChangeReducer, userChangeInitialState };