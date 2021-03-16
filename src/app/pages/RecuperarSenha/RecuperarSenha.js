import React, {Component} from "react";
import {isMobile} from "react-device-detect";
import {inject, observer} from "mobx-react";
import {CircularProgress, Grid, withStyles} from '@material-ui/core';
import classnames from "classnames";
import queryString from "query-string";

import VerticalLine from "../../components/VerticalLine/VerticalLine";
import {Input} from "../../components/Input/Input";
import InputDefault from "../../components/Input/InputDefault";
import Notification from "../../components/Notification";

import logo from "../../assets/img/LogoLogin.png";
import line from "../../assets/img/lineLogin.png";

import recuperarSenhaStyle from "./RecuperarSenha.scss";
import string from "../../utils/string";
import ButtonPrimary from "../../components/Button/ButtonPrimary";

const styles = () => ({
    inputRoot: {
        marginBottom: 15,
        borderRadius: '0.75rem',
        paddingLeft: 20
    },
    input: {
        padding: '15px 0',
    }
});

@inject("recuperarSenhaStore")
@observer
class RecuperarSenha extends Component {
    state = {
        loadingPage: true,
        credentials: {
            login: "",
            novaSenha: "",
            confirmacaoSenha: ""
        },
        erroSenha: false,
        token: null,
    };

    async componentDidMount() {
        const urlParams = queryString.parse(this.props.location.search);

        this.props.recuperarSenhaStore.resetNotification();

        if (urlParams?.token) {
            try {
                await this.props.recuperarSenhaStore.validarToken(urlParams.token);
                this.setState({loadingPage: false, token: urlParams.token});
            } catch (error) {
                console.log(error);
                this.setState({loadingPage: false, token: null});
            }
        } else {
            this.setState({loadingPage: false, token: null});
        }
    }

    handleLoginChange = e =>
        this.setState({
            credentials: {login: e.target.value}
        });

    handleSenhaChange = e => {
        const novaSenha = e.target.value;

        this.setState(state => ({
            credentials: {...state.credentials, novaSenha},
            erroSenha: !this.senhasCoincidem(novaSenha, state.credentials.confirmacaoSenha)
        }));
    };

    handleConfirmarSenhaChange = e => {
        const confirmacaoSenha = e.target.value;
        this.setState(state => ({
            credentials: {...state.credentials, confirmacaoSenha},
            erroSenha: !this.senhasCoincidem(state.credentials.novaSenha, confirmacaoSenha)
        }));
    };

    senhasCoincidem = (novaSenha, confirmacaoSenha) => {
        return novaSenha === confirmacaoSenha;
    };

    async handleRedefinirSenha(event) {
        event.preventDefault();

        try {
            const {credentials} = this.state;

            if (string.isEmpty(credentials.login)) {
                return;
            }

            const {recuperarSenhaStore} = this.props;
            await recuperarSenhaStore.redefinir(credentials.login);
            this.setState({credentials: {login: ""}})
        } catch (error) {
            console.error(error);
        }
    }

    async handleSalvarNovaSenha(event) {
        event.preventDefault();

        try {
            const {credentials, token} = this.state;

            if (string.isEmpty(credentials.novaSenha) || string.isEmpty(credentials.confirmacaoSenha)) {
                return;
            }

            const {recuperarSenhaStore} = this.props;
            await recuperarSenhaStore.salvarNovaSenha(token, credentials.novaSenha, credentials.confirmacaoSenha);

            this.setState({credentials: {login: "", novaSenha: "", confirmacaoSenha: ""}, token: null});

            if (!isMobile) {
                this.props.history.replace('login?redefinir-senha=1');
                return;
            }

            recuperarSenhaStore.openNotification('Sua senha foi redefinida com sucesso.', 'success');
        } catch (error) {
            console.error(error);
        }
    }

    renderLoading = () => (
        <Grid container justify="center" alignContent="center" style={{flex: 1}}>
            <CircularProgress size={32}/>
        </Grid>
    );

    render() {
        const {loadingPage, token, erroSenha, credentials} = this.state;
        const {recuperarSenhaStore, classes} = this.props;

        const style = {
            loginPage: classnames(
                "align-center",
                "content-center",
                recuperarSenhaStyle["login-page"]
            ),
            container: classnames(recuperarSenhaStyle.container),
            panel: classnames("align-center", "content-center", recuperarSenhaStyle.panel),
            logo: classnames(recuperarSenhaStyle.logo),
            formLogin: classnames("content-center", recuperarSenhaStyle["form-login"]),
            inputStyle: classnames(recuperarSenhaStyle["input-login"]),
            buttonStyle: classnames(
                "background-button-primary",
                recuperarSenhaStyle["submit-login"]
            ),
            verticalLine: classnames(recuperarSenhaStyle["vertical-line"])
        };

        return (
            <div>
                <div className={style.loginPage}>
                    <div className={style.panel}>
                        <img className={style.logo} src={logo} alt={"logo"}/>
                    </div>

                    <VerticalLine className={style.verticalLine}/>

                    <div className={style.panel}>
                        {loadingPage && this.renderLoading()}

                        {!loadingPage && !token && (
                            <form
                                onSubmit={this.handleRedefinirSenha.bind(this)}
                                className={style.formLogin}
                            >
                                <Input
                                    className={style.inputStyle}
                                    placeholder="CPF"
                                    value={credentials.login}
                                    onChange={this.handleLoginChange}
                                    id="login"
                                />

                                <ButtonPrimary
                                    type="submit"
                                    className={style.buttonStyle}
                                >
                                    recuperar conta
                                    {recuperarSenhaStore.redefinindo === true && (
                                        <CircularProgress
                                            color="inherit"
                                            size={14}
                                            style={{marginLeft: 10}}
                                        />
                                    )}
                                </ButtonPrimary>
                            </form>
                        )}

                        {!loadingPage && token && (
                            <form
                                onSubmit={this.handleSalvarNovaSenha.bind(this)}
                                className={style.formLogin}
                            >
                                <InputDefault
                                    placeholder="Senha"
                                    value={credentials.novaSenha}
                                    onChange={this.handleSenhaChange}
                                    type="password"
                                    id="password"
                                    error={erroSenha}
                                    classes={{
                                        inputRoot: classes.inputRoot,
                                        input: classes.input,
                                    }}
                                />

                                <InputDefault
                                    placeholder="Confirmar Senha"
                                    value={credentials.confirmacaoSenha}
                                    onChange={this.handleConfirmarSenhaChange}
                                    type="password"
                                    id="confirmar-senha"
                                    error={erroSenha}
                                    classes={{
                                        inputRoot: classes.inputRoot,
                                        input: classes.input,
                                    }}
                                />

                                <ButtonPrimary
                                    type="submit"
                                    className={style.buttonStyle}
                                >
                                    redefinir senha
                                    {recuperarSenhaStore.salvando === true && (
                                        <CircularProgress
                                            color="inherit"
                                            size={14}
                                            style={{marginLeft: 10}}
                                        />
                                    )}
                                </ButtonPrimary>
                            </form>
                        )}
                    </div>

                    <img className="line-login" src={line} alt={"line"}/>
                </div>

                <Notification
                    close={(event, reason) => recuperarSenhaStore.closeNotification(event, reason)}
                    reset={() => recuperarSenhaStore.resetNotification()}
                    isOpen={recuperarSenhaStore.notification.isOpen}
                    variant={recuperarSenhaStore.notification.variant}
                    message={recuperarSenhaStore.notification.message}
                />
            </div>
        );
    }
}

export default withStyles(styles)(RecuperarSenha);
