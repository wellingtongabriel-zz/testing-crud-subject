import axios from "axios";
import { create } from 'apisauce';
import querystring from 'querystring';
import config, { db } from './config';
import localStorageService, { REFRESH_TOKEN_KEY, ACCESS_TOKEN_KEY, REDES_KEY, USUARIO_LOGADO_KEY } from "../services/storage";

const auth = axios.create({
    baseURL: config.authenticationUrlRequest,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    auth: {
        username: config.username,
        password: config.password
    }
});
const authApi = axios.create({
    baseURL: `${config.authenticationUrlRequest}/api/v1`,
    headers: {
        'Content-Type': 'application/json'
    }
});
const redefinirSenha = create({
    baseURL: `${config.authenticationUrlRequest}/public/v1/usuario/redefinir-senha`,
    headers: {
        'Content-Type': 'application/json'
    }
});
const http = axios.create({
    baseURL: `${config.apiUrlRequest}/graphql`,
    headers: {
        'Content-Type': 'application/json'
    }
});

const nestorApi = axios.create({
    baseURL: config.nestorUrlRequest,
    headers: {
        'Accept': 'application/json'
    }
});

// Handle API request errors
const response = async res => {
    return res;
};

const requestRepository = async res => {
    return res;
};

let callRefreshToken = false;
const resetDataOnInvalidGrant = async () => {
    callRefreshToken = false;
    await localStorageService.removeAll();
    await db.remove('chatWindows');
    await window.stores.chatStore.logout();
    window.location.replace('#/login');
};

const responseError = async (error) => {
    if(!error.response) {
        return Promise.reject(error);
    }
    if(!error.response.data) {
        return Promise.reject(error);
    }
    const originalRequest = error.config;
    const refreshToken = await localStorageService.get(REFRESH_TOKEN_KEY);

    if (!callRefreshToken && error.response.data.error === 'invalid_token' && error.response.status === 401 && refreshToken) {
        try {
            callRefreshToken = true;
            const responseToken = await auth.post('/oauth/token',
                querystring.stringify({
                    grant_type: "refresh_token",
                    refresh_token: refreshToken
                })
            );

            const { access_token, refresh_token } = responseToken.data;
            // atualiza o token
            await localStorageService.set(ACCESS_TOKEN_KEY, access_token);
            await localStorageService.set(REFRESH_TOKEN_KEY, refresh_token);

            const authorizationHeader = 'Bearer ' + access_token;
            originalRequest.headers['Authorization'] = authorizationHeader;
            http.defaults.headers['Authorization'] = authorizationHeader;
            authApi.defaults.headers['Authorization'] = authorizationHeader;

            const responseUsuario = await authApi.post('graphql',
                {
                    query: `{
                        obterDadosUsuarioLogado {
                            usuarioLogado {
                                nome
                                login
                                fotoPerfil
                                unidadeAtual {
                                    id
                                    nome
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
            );

            const {usuarioLogado} = responseUsuario.data.data.obterDadosUsuarioLogado;
            const redes = responseUsuario.data.data.obterRedesUsuarioLogado;
            await localStorageService.set(REDES_KEY, redes);
            await localStorageService.set(USUARIO_LOGADO_KEY, usuarioLogado);
            callRefreshToken = false;

            // tenta executar a requisição novamente
            return axios(originalRequest);
        } catch (error) {
            resetDataOnInvalidGrant();
            return Promise.reject(error);
        }
    }
    if(callRefreshToken && error.response.data.error === 'invalid_token' && error.response.status === 401) {
        return axios(originalRequest);
    }

    if(error.response.data.error === 'invalid_grant') {
        resetDataOnInvalidGrant();
        return Promise.reject(error);
    }
    return Promise.reject(error);
};
const request = async (request) => {
    const accessToken = await localStorageService.get(ACCESS_TOKEN_KEY);

    if (!accessToken && !request.auth) {
        window.location.replace('#/login');
        return Promise.reject('unauthorized');
    }

    const authorizationHeader = 'Bearer ' + accessToken;
    request.headers['Authorization'] = authorizationHeader;
    http.defaults.headers['Authorization'] = authorizationHeader;
    authApi.defaults.headers['Authorization'] = authorizationHeader;

    return request;
};

auth.interceptors.response.use(response, responseError);
auth.interceptors.request.use(request);

authApi.interceptors.response.use(response, responseError);
authApi.interceptors.request.use(request);

http.interceptors.response.use(response, responseError);
http.interceptors.request.use(request, (error) => error);

nestorApi.interceptors.response.use(response, (error) => error);
nestorApi.interceptors.request.use(requestRepository, (error) => error);

export const Auth = auth;
export const AuthApi = authApi;
export const RedefinirSenhaApi = redefinirSenha;
export const NestorApi = nestorApi;
export default http;
