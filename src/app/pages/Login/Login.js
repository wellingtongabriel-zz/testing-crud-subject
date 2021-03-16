import React, {Component} from "react";
import {inject, observer} from "mobx-react";

import VerticalLine from "../../components/VerticalLine/VerticalLine";
import Notification from "../../components/Notification";
import {Input} from "../../components/Input/Input";
import Checkbox from "../../components/Checkbox/Checkbox";

import logo from "../../assets/img/LogoLogin.png";
import line from "../../assets/img/lineLogin.png";

import {Auth} from "../../config/api";
import config from "../../config/config";

import loginStyle from "./Login.scss";
import classnames from "classnames";
import {CircularProgress, FormControlLabel} from "@material-ui/core";
import {Link} from "react-router-dom";
import queryString from "query-string";
import {findUnidadeLogada} from "../../services/UnidadeService";

const querystring = require("querystring");

@inject("loginStore", "usuarioStore", "chatStore")
@observer
class Login extends Component {
    state = {
        credentials: {
            login: "",
            password: ""
        }
    };

    componentDidMount() {
        const {loginStore, location} = this.props;

        loginStore.localLogin();
        loginStore.resetNotification();

        const urlParams = queryString.parse(location.search);

        if (urlParams['redefinir-senha']) {
            loginStore.openNotification('Sua senha foi redefinida com sucesso.', 'success');
        }

        if (urlParams['documento']) {
            this.setState({
                credentials: {...this.state.credentials, login: urlParams.documento}
            });
        }
    }

    handleLoginChange = e =>
        this.setState({
            credentials: {...this.state.credentials, login: e.target.value}
        });
    handlePasswordChange = e =>
        this.setState({
            credentials: {...this.state.credentials, password: e.target.value}
        });

    async onClickLogin(e) {
        e.preventDefault();
        this.setState({loading: true});

        Auth.post("oauth/token", querystring.stringify({
            grant_type: "password",
            username: this.state.credentials.login,
            password: this.state.credentials.password,
            client_id: config.clientId
        }))
            .then(async (response) => {
                await this.props.loginStore.saveTokens(response.data);

                this.props.loginStore.getUser().then(async response => {
                    const redes = response.data.data.obterRedesUsuarioLogado;
                    this.props.usuarioStore.isAuthenticated = true;

                    try {
                        this.props.chatStore.authenticate();
                    } catch (error) {
                        console.error(error);
                    }

                    if (redes && redes.length > 1) {
                        this.props.history.push({
                            pathname: "/select-rede",
                            state: {redes}
                        });

                        return;
                    }

                    await findUnidadeLogada();

                    this.props.history.push("/");
                });
            })
            .catch(response => {
                this.props.usuarioStore.isAuthenticated = false;
                this.props.loginStore.loginError(response.response);
            })
            .finally(() => {
                this.setState({loading: false});
            });
    }

    render() {
        const {credentials, loading} = this.state;
        const {loginStore} = this.props;

        const style = {
            loginPage: classnames(
                "align-center",
                "content-center",
                loginStyle["login-page"]
            ),
            container: classnames(loginStyle.container),
            panel: classnames("align-center", "content-center", loginStyle.panel),
            logo: classnames(loginStyle.logo),
            formLogin: classnames("content-center", loginStyle["form-login"]),
            inputStyle: classnames(loginStyle["input-login"]),
            checkboxStyle: classnames(loginStyle["checkbox-login"]),
            buttonStyle: classnames(
                "background-button-primary",
                loginStyle["submit-login"]
            ),
            esqueciMinhaSenhaStyle: classnames(loginStyle["esqueci-minha-senha"]),
            esqueciMinhaSenhaLinkStyle: classnames(loginStyle["link"]),
            verticalLine: classnames(loginStyle["vertical-line"])
        };

        return (
            <div>
                <div className={style.loginPage}>
                    <div className={style.panel}>
                        <img className={style.logo} src={logo} alt={"logo"}/>
                    </div>

                    <VerticalLine className={style.verticalLine}/>

                    <div className={style.panel}>
                        <form
                            onSubmit={this.onClickLogin.bind(this)}
                            className={style.formLogin}
                        >
                            <Input
                                className={style.inputStyle}
                                placeholder="CPF"
                                value={credentials.login}
                                onChange={this.handleLoginChange}
                                id="login"
                            />

                            <Input
                                className={style.inputStyle}
                                placeholder="Senha"
                                value={credentials.password}
                                onChange={this.handlePasswordChange}
                                type="password"
                                id="password"
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color="primary"
                                        checked={credentials.connected}
                                        value="connected"
                                    />
                                }
                                style={{marginLeft: 10}}
                                label="Mantenha-me conectado"
                            />

                            <button
                                type="submit"
                                className={style.buttonStyle}
                            >
                                Entrar
                                {loading && (
                                    <CircularProgress
                                        color="inherit"
                                        size={12}
                                        style={{marginLeft: 10}}
                                    />
                                )}
                            </button>

                            <div className={style.esqueciMinhaSenhaStyle}>
                                <Link to="redefinir-senha" className={style.esqueciMinhaSenhaLinkStyle}>iih! Esqueci
                                    minha senha</Link>
                            </div>
                        </form>
                    </div>

                    <img className="line-login" src={line} alt={"line"}/>
                </div>

                <Notification
                    close={(event, reason) => loginStore.closeNotification(event, reason)}
                    reset={() => loginStore.resetNotification()}
                    isOpen={loginStore.notification.isOpen}
                    variant={loginStore.notification.variant}
                    message={loginStore.notification.message}
                />
            </div>
        );
    }
}

export default Login;
