import React, { useContext, useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import { Context } from "store";
import { loginActions } from "./store/reducers/login";

import 'assets/css/app.css';
import Loading from "views/examples/Loading";
import { Toast } from "components/Sidebar/Toast";
import { authenticate } from "variables/accessToken";
import { loadingActions } from "./store/reducers/loading";

function App() {

  const { state, dispatch } = useContext(Context);

  useEffect(() => {
    authenticate()
    .then(data => {
      if (data) {
        dispatch({ type: loginActions.LOGIN });          
      }
    })
    .finally(dispatch({ type: loadingActions.LOADING_OFF}));
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
