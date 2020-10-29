import React, { useContext, useEffect, useRef } from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";
import { Context } from "store";

function Admin(props) {

  const mounted = useRef();

  const history = useHistory();

  const { state, dispatch } = useContext(Context);

  useEffect(() => {
    if (!mounted.current) {      
      if (!state.login.loggedOn) {
        // history.push('/auth');
      }            
      mounted.current = true;
    } else {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
  }, [dispatch, history, state]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  }

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  }

return (
      <>
        <Sidebar
          {...props}
          routes={routes}
          logo={{
            innerLink: "/admin/index",
            imgSrc: require("assets/img/brand/SmallLogo.png"),
            imgAlt: "..."
          }}
        />
        <div className="main-content" ref={useRef('mainContent')}>
          <AdminNavbar
            {...props}
            brandText={getBrandText(props.location.pathname)}
          />
          <Switch>
            {getRoutes(routes)}
            <Redirect from="*" to="/admin/users" />
          </Switch>
        </div>
      </>
    );
}

export default Admin;
