import React from "react";
import ReactDOM from "react-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import { Provider } from "store";
import App from "app";

ReactDOM.render(
  <Provider>
    <App/>
  </Provider>,
  document.getElementById("root")
);
