import {ImmortalStorage, IndexedDbStore, LocalStorageStore} from 'immortal-db';

const config = () => {
    let
        protocol = 'https://',
        apiUrl = 'back.homolog.apphealth.com.br:8443',
        authenticationUrl = 'back.homolog.apphealth.com.br:9000',
        nestorUrl = 'nestor.apphealth.com.br:8444';
        // protocol = 'http://',
        // apiUrl = 'localhost:8080',
        // authenticationUrl = 'localhost:9000',
        // nestorUrl = 'nestor.apphealth.com.br:8444';

    const username = 'APPHEALTH_WEB';
    const password = 'apphealth';

    return {
        protocol,
        username,
        password,
        clientId: username,
        userInfo: `${username}:${password}`,
        apiUrl: apiUrl,
        authenticationUrl: authenticationUrl,
        nestorUrl: nestorUrl,

        authenticationUrlRequest: protocol + authenticationUrl,
        apiUrlRequest: protocol + apiUrl + '/api/v1',
        nestorUrlRequest: protocol + nestorUrl,
    }
};

export const db = new ImmortalStorage([LocalStorageStore, IndexedDbStore]);

export const buildUrlDownload = (fileUrl, token) => {
    const {protocol, apiUrl} = config();
    return `${protocol}${apiUrl}${fileUrl}?access_token=${token}`;
};
export const buildUrlMiniatura = (fileUrl, token) => {
    const {protocol, apiUrl} = config();
    return `${protocol}${apiUrl}${fileUrl}?access_token=${token}`;
};

export const buildUrlFotoPerfil = (fotoPerfilId, token) => {
    const {protocol, nestorUrl} = config();
    return `${protocol}${nestorUrl}/resource/AppHealth/${token}/${fotoPerfilId}`;
};

export const request = config => {
    return config;
};

export const requestError = error => {
    return Promise.reject(error);
};

export const response = response => {
    return response;
};

export const responseError = error => {

    return Promise.reject(error);
};

export default new config();
