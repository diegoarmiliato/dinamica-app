import React, { createContext, useReducer } from 'react';
import { loginReducer, loginInitialState } from './reducers/login';
import { loadingReducer, loadingInitialState } from './reducers/loading';
import { userCreateReducer, userCreateInitialState } from './reducers/userCreate';
import { userListReducer, userListInitialState } from './reducers/userList';

export const INITIAL_STATE = {
  login: loginInitialState,
  loading: loadingInitialState,
  userCreate: userCreateInitialState,
  userList: userListInitialState
}

const Context = createContext({
    state: INITIAL_STATE,
    dispatch: () => null
  });

const mainReducer = ({ login, loading, userCreate, userList}, action) => ({
  login: loginReducer(login, action),
  loading: loadingReducer(loading, action),
  userCreate: userCreateReducer(userCreate, action),
  userList: userListReducer(userList, action)
});

const Provider = ( { children } ) => {
    const [state, dispatch] = useReducer(mainReducer, INITIAL_STATE);
    return (
      <Context.Provider value={{state, dispatch}}>
        {children}
      </Context.Provider>
    )
}

export { Context, Provider }