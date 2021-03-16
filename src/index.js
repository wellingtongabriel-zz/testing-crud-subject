import React from "react";
import { render } from "react-dom";
import { HashRouter } from "react-router-dom";
import { Provider } from "mobx-react";
import "./app/config/moment";

import "./app/assets";
import Routes from "./routes";

import stores from "./app/stores/Root.store";

import { initializeFirebase } from "./push-notification";

initializeFirebase();

const app = document.getElementById("app");
window.stores = stores;

render(
  <Provider {...stores}>
    <HashRouter>
      <Routes />
    </HashRouter>
  </Provider>,
  app
);

if (process.env.NODE_ENV !== "production") {
  require("mobx-logger").enableLogging({
    action: true,
    reaction: false,
    transaction: true,
    compute: false
  });
}
