import React, { createContext, useReducer } from 'react';
import { loginReducer, loginInitialState } from './reducers/login';
import { loadingReducer, loadingInitialState } from './reducers/loading';
import { userReducer, userInitialState } from './reducers/user';

export const INITIAL_STATE = {
  login: loginInitialState,
  loading: loadingInitialState,
  user: userInitialState
}

const Context = createContext({
    state: INITIAL_STATE,
    dispatch: () => null
  });

const mainReducer = ({ login, loading, user}, action) => ({
  login: loginReducer(login, action),
  loading: loadingReducer(loading, action),
  user: userReducer(user, action)
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