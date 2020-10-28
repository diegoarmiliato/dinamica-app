const userListActions = {
  SET_USERLIST_FULL: 'SET_USERLIST_FULL',
  SET_USERLIST_ENTRIES: 'SET_USERLIST_ENTRIES',
  SET_USERLIST_PAGE: 'SET_USERLIST_PAGE',
  SET_USERLIST_FILTER: 'SET_USERLIST_FILTER',
  SET_USERLIST_PAGECOUNT: 'SET_USERLIST_PAGECOUNT',
  SET_USERLIST_ACTIVE: 'SET_USERLIST_ACTIVE'
}

const userListInitialState = {
  apiResult: [],
  users: [],  
  numberEntries: 10,
  currentPage: 1,
  pageCount: 1,
  filter: '',  
}

const userListReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case userListActions.SET_USERLIST_FULL:
      const pageCountList = getPageCount(payload.length, state.numberEntries);
      return { ...state, 
               apiResult: payload, 
               users: payload, 
               pageCount: pageCountList, 
               currentPage: 1, 
               filter: '' }
    case userListActions.SET_USERLIST_ENTRIES:
      return { ...state, 
               numberEntries: payload }
    case userListActions.SET_USERLIST_PAGE:
      return { ...state, 
               currentPage: payload }
    case userListActions.SET_USERLIST_FILTER:
      const newUsersArray = filterUsers(state.apiResult, payload);
      const pageCountFilter = getPageCount(newUsersArray.length, state.numberEntries);
      return { ...state, 
              filter: payload, 
              users: newUsersArray, 
              currentPage: 1, 
              pageCount: pageCountFilter }
    case userListActions.SET_USERLIST_PAGECOUNT:
      return { ...state, pageCount: getPageCount(payload) }
    case userListActions.SET_USERLIST_ACTIVE:
      return { ...state,  
              apiResult: changeActiveUser(state.apiResult, payload.username, payload.active), 
              users: changeActiveUser(state.users, payload.username, payload.active)}
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

const changeActiveUser = (userList, username, status) => {
  return userList.map((user) => {
    return user.username === username ? { ...user, active: status } : user;
  });
}

export { userListActions, userListReducer, userListInitialState };