import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import Financeiro from "./Financeiro";
import Configuracoes from "./Configuracoes";
import SujeitoAtencao from './SujeitoAtencao'

const CheckRoute = props => {
  const { component: Component, isAuthenticated, location } = props;
  return isAuthenticated ? (
    <Component {...props} />
  ) : (
    <Redirect
      to={{
        pathname: "/login",
        state: { from: location }
      }}
    />
  );
};

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    component={props => (
      <CheckRoute
        isAuthenticated={isAuthenticated}
        component={Component}
        {...props}
      />
    )}
  />
);

const Routes = ({ isAuthenticated }) => (
  <Switch>
    <PrivateRoute
      path="/financeiro"
      component={Financeiro}
      isAuthenticated={isAuthenticated}
    />

    <PrivateRoute
        path="/sujeitoDeAtencao"
        component={SujeitoAtencao}
        isAuthenticated={isAuthenticated}/>

    <PrivateRoute
      path="/configuracoes"
      component={Configuracoes}
      isAuthenticated={isAuthenticated}
    />
  </Switch>
);

export default Routes;
