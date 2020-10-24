import React, { useContext, useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import { Context } from "store";
import { api } from "assets/tools/api";
import { loginActions } from "store/reducers/login";

import 'assets/css/app.css';
import Loading from "views/examples/Loading";
import { Toast } from "components/Sidebar/Toast";

function App() {

  const { state, dispatch } = useContext(Context);

  useEffect(() => {
    api.post('/login')
    .then((res) => {      
      if (res.data.status) {        
        dispatch({ type: loginActions.LOGIN, payload: { username: res.data.username, firstName: res.data.firstName, lastName: res.data.lastName} });
        dispatch({ type: loginActions.SET_LOGIN_PASSWORD, payload: ''});
        // dispatch({ type: 'LOADING_OFF'});
      }
    })
    .finally(() => dispatch({ type: 'LOADING_OFF'}));
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
        <Redirect from="/" to="/admin/index" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
