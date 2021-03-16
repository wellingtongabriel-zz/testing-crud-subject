import React from "react";
import Route from "react-router-dom/Route";
import { matchPath } from "react-router";
import classnames from "classnames";
import { Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import styles from "../../assets/jss/pages/configuracoesStyle";
import PanelLeft from "../../components/PanelLeft/PanelLeft";
import Footer from "../../components/Footer/Footer";
import Header from "../../template/Header/Header";
import SubMenu from "./Menu/SubMenu";
import ConvenioListPage from "./Convenio/ConvenioListPage";
import ButtonActionFooter from "../../components/ButtonActionFooter"
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox";
import { inject } from "mobx-react";

const routes = [
    {
        uri: "/convenios",
        title: "Convênios",
        component: ConvenioListPage,
        menu: true,
    },
];

@inject("configuracaoImpressaoStore")
class Configuracoes extends React.Component {
    state = {
        subMenuItens: [],
        showSidebar: true,
    };

    componentDidMount() {
        const { history, match, location } = this.props;

        const subMenuItens = routes.filter(route => route.menu === true);

        const showSidebar = routes.filter(route => {
            return route.menu === false && matchPath(location.pathname, {
                path: `${match.path}${route.uri}`,
                exact: true,
            });
        }).length === 0;

        this.setState({ subMenuItens, showSidebar }, () => {
            const item = this.state.subMenuItens[0] || null;
            if (item && match.isExact) {
                history.push(`${match.path}${item.uri}`);
            }
        });
    }

    handleSave = () => {
        const { configuracaoImpressaoStore } = this.props;
        configuracaoImpressaoStore.save();
    };

    render() {
        const { classes, match, location } = this.props;
        const { subMenuItens, showSidebar } = this.state;

        const isConfiguracaoReceitaPage =
            location && location.pathname && location.pathname === "/configuracoes/receita";

        return (
            <div className={classnames(classes.root, showSidebar ? null : classes.rootWithoutSidebar)}>
                {showSidebar && (
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
                                    <h3 className={classes.titleHeader}>
                                        Configurações
                                    </h3>
                                </Grid>
                            </Header>
                        </Grid>

                        <SubMenu items={subMenuItens} />
                    </PanelLeft>
                )}

                {routes.map(item => (
                    <Route
                        exact
                        key={item.uri}
                        path={`${match.path}${item.uri}`}
                        component={item.component}
                    />
                ))}

                <Footer className={classes.footer}>
                    <Grid container className={classes.footerContainer}>
                        {isConfiguracaoReceitaPage && (
                            <ButtonActionFooter onClick={this.handleSave} icon={MoveToInboxIcon} label={'Salvar'} classes={{ root: classes.footerButton, label: classes.footerButtonLabel }} />
                        )}
                    </Grid>
                </Footer>
            </div>
        );
    }
}

export default withStyles(styles)(Configuracoes);
