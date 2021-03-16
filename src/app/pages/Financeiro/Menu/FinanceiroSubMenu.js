import React from "react";

import Grid from "@material-ui/core/Grid";
import ItemSubMenu from "./ItemSubMenu";
import { withRouter } from "react-router-dom";

class FinanceiroSubMenu extends React.PureComponent {
  render() {
    const { match, location } = this.props;

    return (
      <Grid container direction={"column"} wrap={"nowrap"}>
        <ItemSubMenu
          to={match.url}
          name={"Extrato"}
          location={location}
        />

        <ItemSubMenu
          to={`${match.url}/contas-bancarias`}
          name={"Contas Bancárias"}
          location={location}
        />

        <ItemSubMenu
          to={`${match.url}/categorias`}
          name={"Categorias Financeiras"}
          location={location}
        />
        
        <ItemSubMenu
          to={`${match.url}/centro-de-custos`}
          name={"Centro de Custos"}
          location={location}
        />
      </Grid>
    );
  }
}

export default withRouter(FinanceiroSubMenu);
