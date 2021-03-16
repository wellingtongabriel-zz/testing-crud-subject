import React from "react";
import { withRouter } from "react-router-dom";
import { inject } from "mobx-react";
import LogoImage from "../../components/LogoImage/LogoImage";
import {
  MenuItem,
  MenuList,
  ClickAwayListener,
  Paper,
  Grow,
  Popper
} from "@material-ui/core";
import ButtonTransparent from "../../components/Button/ButtonTransparent";
import localStorageService, { REDES_KEY, USUARIO_LOGADO_KEY, ACCESS_TOKEN_KEY } from "../../services/storage";
import { buildUrlFotoPerfil } from "../../config/config";

@inject('loginStore', 'profissionalSaudeStore', 'usuarioStore')
class Profile extends React.Component {
  state = {
    user: null,
    redes: null,
    accessToken: null,
    openMenu: false,
    openMudarSenha: false
  };
  mounted = false;

  componentDidMount() {
    this.mounted = true;
    this.getUsuarioLogado();
  }
  
  componentWillUnmount() {
    this.mounted = false;
  }

  async getUsuarioLogado() {
    const user = await localStorageService.get(USUARIO_LOGADO_KEY);
    const redes = await localStorageService.get(REDES_KEY);
    const accessToken = await localStorageService.get(ACCESS_TOKEN_KEY);
    
    if (!this.mounted) {
      return;
    }
    
    this.setState({ user, redes, accessToken });
  }

  handleToggleMenu = () => {
    this.setState(state => ({
      openMenu: !state.openMenu
    }));
  };

  handleCloseMenu = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ openMenu: false });
  };
  
  handleClickAlterarUnidade = () => {
    this.setState({ openMenu: false }, () => {
        this.props.history.push({
            pathname: '/select-rede',
            state: { redes: this.state.redes }
        });
    });
  };
  
  handleClickLogout = () => {
    this.setState({ openMenu: false }, () => {
        this.props.loginStore.logout(this.props);
    });
  };

  render() {
    const { user, openMenu, redes, accessToken } = this.state;
    const { usuarioStore, profissionalSaudeStore } = this.props;
    return (
      <React.Fragment>
        <ButtonTransparent
          ref={node => (this.anchorEl = node)}
          aria-owns={this.anchorEl ? "menu-profile" : undefined}
          aria-haspopup="true"
          onClick={this.handleToggleMenu}
        >
          { accessToken && (
            <LogoImage
            text={profissionalSaudeStore.profissionalSaude.nome || (user && user.profissionalSaudeAtual?.nome ? user.profissionalSaudeAtual.nome : "")}
            image={buildUrlFotoPerfil(usuarioStore.fotoPerfil || user?.fotoPerfil, accessToken)} />
          )}
        </ButtonTransparent>
        <Popper
          open={openMenu}
          anchorEl={this.anchorEl}
          transition
          disablePortal
          style={{ zIndex: 1000 }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="menu-profile"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper style={{ minWidth: 150 }}>
                <ClickAwayListener onClickAway={this.handleCloseMenu}>
                  <MenuList>
                    {redes && redes.length > 1 ? (
                      <MenuItem onClick={this.handleClickAlterarUnidade}>
                        Alterar Unidade
                      </MenuItem>
                    ) : null}
                    <MenuItem onClick={this.handleClickLogout}>Logout</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </React.Fragment>
    );
  }
}

export default withRouter(Profile);
