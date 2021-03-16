import React from "react";

import { withStyles } from "@material-ui/core/styles";

import styles from "../../assets/jss/pages/financeiroStyle";
import PanelLeft from "../../components/PanelLeft/PanelLeft";
import Footer from "../../components/Footer/Footer";
import Header from "../../template/Header/Header";
import { inject, observer } from "mobx-react";
import { Grid, Typography } from "@material-ui/core";
import FinanceiroSubMenu from "./Menu/FinanceiroSubMenu";
import Route from "react-router-dom/Route";
import Extrato from "./Extrato/Extrato";
import Categoria from "./Categoria/Categoria";
import CentroDeCusto from "./CentroDeCusto/CentroDeCusto";
import ContaBancaria from "./ContaBancaria/ContaBancaria";

@inject("extratoStore")
@observer
class Financeiro extends React.Component {
  render() {
    const { classes, match, location, extratoStore } = this.props;
    const { totais } = extratoStore;

    const isExtratoPage =
      location && location.pathname && location.pathname === "/financeiro"
        ? true
        : false;

    return (
      <div className={classes.root}>
        <PanelLeft className={classes.panelLeft}>
          <Grid item>
            <Header>
              <Grid
                item
                container
                alignItems={"center"}
                justify={"center"}
                xs={12}
              >
                <h3 className={classes.titleHeader}>Financeiro</h3>
              </Grid>
            </Header>
          </Grid>

          <FinanceiroSubMenu />
        </PanelLeft>

        <Route exact path={match.path} component={Extrato} />
        <Route path={`${match.path}/categorias`} component={Categoria} />
        <Route
          path={`${match.path}/contas-bancarias`}
          component={ContaBancaria}
        />
        <Route
          path={`${match.path}/centro-de-custos`}
          component={CentroDeCusto}
        />

        <Footer className={classes.footer}>
          <Grid container>
            <Grid item xs={9} xl={10} />
            <Grid item xs={3} xl={2}>
              {isExtratoPage && (
                <div className={classes.totais}>
                  <Typography className={classes.totalReceitaLabel}>
                    Total Receita: <span>{totais.totalReceitaFormatted}</span>
                  </Typography>
                  <Typography className={classes.totalDespesaLabel}>
                    Total Despesa: <span>{totais.totalDespesaFormatted}</span>
                  </Typography>
                  <Typography className={classes.totalLabel}>
                    Total:{" "}
                    <span
                      className={totais.total > 0 ? "positivo" : "negativo"}
                    >
                      {totais.totalFormatted}
                    </span>
                  </Typography>
                </div>
              )}
            </Grid>
          </Grid>
        </Footer>
      </div>
    );
  }
}

export default withStyles(styles)(Financeiro);
