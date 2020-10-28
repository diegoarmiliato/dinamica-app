const userListActions = {
  SET_USERLIST_FULL: 'SET_USERLIST_FULL',
  SET_USERLIST_ENTRIES: 'SET_USERLIST_ENTRIES',
  SET_USERLIST_PAGE: 'SET_USERLIST_PAGE',
  SET_USERLIST_FILTER: 'SET_USERLIST_FILTER',
  SET_USERLIST_PAGECOUNT: 'SET_USERLIST_PAGECOUNT'
}

const userListInitialState = {
  apiResult: [],
  users: [],  
  numberEntries: 10,
  currentPage: 1,
  pageCount: 1,
  filter: ''
}

const userListReducer = (state, action) => {
  switch (action.type) {
    case userListActions.SET_USERLIST_FULL:
      const pageCountList = getPageCount(action.payload.length, state.numberEntries);
      return { ...state, apiResult: action.payload, users: action.payload, pageCount: pageCountList}
    case userListActions.SET_USERLIST_ENTRIES:
      return { ...state, numberEntries: action.payload }
    case userListActions.SET_USERLIST_PAGE:
      return { ...state, currentPage: action.payload }
    case userListActions.SET_USERLIST_FILTER:
      const newUsersArray = filterUsers(state.apiResult, action.payload);
      const pageCountFilter = getPageCount(newUsersArray.length, state.numberEntries);
      return { ...state, filter: action.payload, users: newUsersArray, currentPage: 1, pageCount: pageCountFilter }
    case userListActions.SET_USERLIST_PAGECOUNT:
      return { ...state, pageCount: getPageCount(action.payload) }
    default:
      return state;
  }
}

const filterUsers = (full, filter) => {
  return full.filter((user) => (Object.values(user).find((res) => {
    const regex = new RegExp(filter, 'i'); 
    return regex.test(res) ? user : undefined;
  })))
}

const getPageCount = (size, entries) => {
  const divide = Math.floor(size / entries);
  const remainder =  size % entries;
  return remainder > 0 ? divide+1 : divide;
}

export { userListActions, userListReducer, userListInitialState };