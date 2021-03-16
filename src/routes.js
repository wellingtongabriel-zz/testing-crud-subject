import React from "react";
import { Route } from "react-router-dom";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "material-ui-pickers";

import App from "./app/pages/App";
import Login from "./app/pages/Login/Login";
import RecuperarSenha from "./app/pages/RecuperarSenha/RecuperarSenha";
import SelectRede from "./app/pages/SelectRede";
import Theme from "./app/template/Theme";

class Routes extends React.Component {
  render() {
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Theme>
          <Route path="/login" component={Login} />
          <Route path="/redefinir-senha" component={RecuperarSenha} />
          <Route path="/select-rede" component={SelectRede} />
          <Route path="/" component={App} />
        </Theme>
      </MuiPickersUtilsProvider>
    );
  }
}

export default Routes;
