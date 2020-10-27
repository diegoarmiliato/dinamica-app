const userListActions = {
  SET_USERLIST_FULL: 'SET_USERLIST_FULL',
  SET_USERLIST_ENTRIES: 'SET_USERLIST_ENTRIES',
  SET_USERLIST_PAGE: 'SET_USERLIST_PAGE',
  SET_USERLIST_FILTER: 'SET_USERLIST_FILTER'
}

const userListInitialState = {
  users: [],
  table: [],
  numberEntries: 10,
  currentPage: 1,
  pageCount: 1,
  filter: ''
}

const userListReducer = (state, action) => {
  switch (action.type) {
    case userListActions.SET_USERLIST_FULL:
      return { ...state, users: action.payload}
    case userListActions.SET_USERLIST_ENTRIES:
      return { ...state, numberEntries: action.payload }
    case userListActions.SET_USERLIST_PAGE:
      return { ...state, currentPage: action.payload }
    case userListActions.SET_USERLIST_FILTER:
      return { ...state, filter: action.payload }
    default:
      return state;
  }
}


export { userListActions, userListReducer, userListInitialState };