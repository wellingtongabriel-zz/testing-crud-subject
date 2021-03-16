import React from "react";
import { Link, withRouter } from "react-router-dom";
import classnames from "classnames";
import menuStyles from "./Menu.scss";

import {
  Settings,
} from "@material-ui/icons";

import images from "../../assets/img/images";

import ItemMenu from "./ItemMenu/ItemMenu";
import Grid from "@material-ui/core/Grid";
import Financeiro from "../../components/Icon/Financeiro";
import { inject, observer } from "mobx-react";

import SujeitoAtencaoIcone from '../../components/Icon/SujeitoAtencao';

@inject("chatStore")
@observer
class Btn extends React.Component {
  render() {
    const { chatStore} = this.props;
    const style = {
      logo: classnames(menuStyles.logo),
      navbar: classnames(menuStyles.navbar)
    };

    return (
      <Grid
        container
        direction={"column"}
        wrap={"nowrap"}
        className={classnames(menuStyles.nav)}
      >
        <Link to="/">
          <Grid item className={style.logo}>
            <img src={images.logoMenu} alt={"logo"} />
          </Grid>
        </Link>

        <Grid
          item
          container
          xs={12}
          direction={"column"}
          className={style.navbar}
        >
          <ItemMenu title="Financeiro" to={"/financeiro"} icon={Financeiro} />

          <ItemMenu 
            title="Sujeito de Atenção" 
            to={"/sujeitoDeAtencao"} 
            icon={SujeitoAtencaoIcone} />

          <ItemMenu
            title="Configurações"
            to={"/configuracoes"}
            icon={Settings}
          />
        </Grid>
      </Grid>
    );
  }
}


export default withRouter(Btn);
