import {action, observable} from 'mobx';

import InterceptorUtil from "../utils/InterceptorUtil"

import Api, {AuthApi} from "../config/api";
import localStorageService, {
    ACCESS_TOKEN_KEY,
    getAuthLocal,
    REDES_KEY,
    REFRESH_TOKEN_KEY,
    USUARIO_LOGADO_KEY
} from '../services/storage';
import BaseStore from "./Base.store";
import { db } from '../config/config';


export default class LoginStore extends BaseStore {
    interceptorApi = null;
    interceptorAuthApi = null;

    filtroHeaderStore = null;
    usuarioStore = null;
    chatStore = null;

    @observable accessToken = null;
    @observable refreshToken = null;

    constructor(rootStore) {
        super();
        this.usuarioStore = rootStore.usuarioStore;
        this.chatStore = rootStore.chatStore; 
        this.localLogin();
    }

    /**
     * Handle login error
     * @param response
     */
    @action loginError(response) {
        this.accessToken = null;
        this.refreshToken = null;
        this.error = response;
        this.openNotification('Usuário inexistente ou senha inválida', 'error');
    }

    @action getUser() {
        return AuthApi.post('graphql',
            {
                query: `{
                    obterDadosUsuarioLogado {
                        usuarioLogado {
                            id
                            nome
                            login
                            fotoPerfil
                            unidadeAtual {
                                id
                                nome
                                cnpj
                                rede {
                                    id
                                    nome
                                }
                            }
                            profissionalSaudeAtual {
                                id,
                                nome,
                                cns,
                                cpf
                            }
                            authorities {
                                authority
                            }
                        }
                    }
                    obterRedesUsuarioLogado {
                        nome
                        unidades {
                            id
                            nome
                        }
                    }
                }`
            }
        ).then(async (response) => {
            const {usuarioLogado} = response.data.data.obterDadosUsuarioLogado;
            const redes = response.data.data.obterRedesUsuarioLogado;
            await localStorageService.set(REDES_KEY, redes);
            await localStorageService.set(USUARIO_LOGADO_KEY, usuarioLogado);
            return response;
        })
    }

    /**
     * Try to connect user from local storage
     */
    async localLogin() {
        const {accessToken, refreshToken, usuarioLogado} = getAuthLocal();

        if (accessToken && refreshToken && usuarioLogado && usuarioLogado.id) {
            this.usuarioStore.isAuthenticated = true;
            await this.saveTokens({access_token: accessToken, refresh_token: refreshToken});
        }
    }


    @action
    async logout({history}) {
        const accessToken = await localStorageService.get(ACCESS_TOKEN_KEY);
        await AuthApi.get(`logout?token=${accessToken}`);
        await localStorageService.removeAll();
        await db.remove('chatWindows');

        if (this.filtroHeaderStore) {
            this.filtroHeaderStore.unidade = 0;
            this.filtroHeaderStore.profissionalSaude = 0;
        }

        if (this.usuarioStore) {
            this.usuarioStore.isAuthenticated = false;
        }

        this.chatStore.logout();

        history.replace("/login");
    }

    @action
    async saveTokens(params) {
        const {access_token, refresh_token} = params;

        Api.interceptors.request.eject(this.interceptorApi);
        AuthApi.interceptors.request.eject(this.interceptorAuthApi);

        await localStorageService.set(ACCESS_TOKEN_KEY, access_token);
        await localStorageService.set(REFRESH_TOKEN_KEY, refresh_token);

        this.accessToken = access_token;
        this.refreshToken = refresh_token;
        this.error = null;


        const _setHeader = (config) => {
            config.headers.post['Authorization'] = `bearer ${access_token}`;
            config.headers.get['Authorization'] = `bearer ${access_token}`;
            return config;
        };

        this.interceptorApi = Api.interceptors.request.use(_setHeader);
        this.interceptorAuthApi = AuthApi.interceptors.request.use(_setHeader);

        InterceptorUtil.setInterceptor(this.interceptorApi);
        InterceptorUtil.setInterceptor(this.interceptorAuthApi);
    }
}
