import React, { useContext, useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import { Context } from "store";
import { api } from "assets/tools/api";
import { loginActions } from "store/reducers/login";

import 'assets/css/app.css';
import Loading from "views/examples/Loading";
import { Toast, toastMessage, toastTypes } from "components/Sidebar/Toast";

function App() {

  const { state, dispatch } = useContext(Context);

  useEffect(() => {
    api.post('/login')
    .then((res) => {      
      if (res.data.status) {    
        if (res.data.orgUnit === 'Funcionarios') {    
          dispatch({ type: loginActions.LOGIN, payload: { username: res.data.username, firstName: res.data.firstName, lastName: res.data.lastName} });
          dispatch({ type: loginActions.SET_LOGIN_PASSWORD, payload: ''});
        } else {
          api.post('/logoff');
          dispatch({ type: loginActions.LOGOFF});
          toastMessage(toastTypes.error, 'Erro', 'Usuário não autorizado\nRealizado logoff');
        }
      }
    })
    .catch((err) => toastMessage(toastTypes.error, 'Erro', err.message))
    .finally(() => dispatch({ type: 'LOADING_OFF'}));
    // dispatch({ type: 'LOADING_OFF'});
  }, [dispatch]);

  const secureRoute = (props) => {
    return state.login.loggedOn ? <AdminLayout {...props} /> : <AuthLayout {...props} />;
  }

  return(
    <BrowserRouter>
      <Loading/>
      <Toast/>
      <Switch>        
        <Route path="/admin" render={props => secureRoute(props)} />
        <Route path="/auth" render={props => secureRoute(props)} />
        <Redirect from="/" to="/admin/users" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
