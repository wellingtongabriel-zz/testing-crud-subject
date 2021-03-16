import {action, observable} from 'mobx';
import {RedefinirSenhaApi} from "../config/api";
import BaseStore from "./Base.store";
import config from "../config/config";

export default class RecuperarSenhaStore extends BaseStore {
    @observable redefinindo = false;
    @observable salvando = false;

    @action
    async redefinir(login) {
        try {
            this.redefinindo = true;
            const response = await RedefinirSenhaApi.post('',
                {
                    login: login,
                    clientId: config.clientId,
                }
            );

            if (response.ok) {
                return this.openNotification(`Enviamos para seu e-mail ${response.data.mensagem} o link para redefinir sua senha.`, 'success');
            }

            if (typeof response.data.mensagem === 'string') {
                throw new Error(response.data.mensagem);
            }
        } catch (error) {
            this.openNotification(error.message, 'warning');
        } finally {
            this.redefinindo = false;
        }
    }

    @action
    async validarToken(token) {
        try {
            const response = await RedefinirSenhaApi.get(`${token}`);

            if (response.ok) {
                return response;
            }

            if (typeof response.data.mensagem === 'string') {
                throw new Error(response.data.mensagem);
            }
        } catch (error) {
            this.openNotification(error.message, 'warning');
            throw error;
        }
    }

    @action
    async salvarNovaSenha(token, senha, confirmacaoSenha) {
        try {
            this.salvando = true;

            if (senha !== confirmacaoSenha) {
                throw new Error('Senha não coincide com a confirmação de senha.');
            }

            const response = await RedefinirSenhaApi.put(`${token}`,
                {
                    senha
                }
            );

            if (response.ok) {
                return response;
            }

            if (typeof response.data.mensagem === 'string') {
                throw new Error(response.data.mensagem);
            }
        } catch (error) {
            this.openNotification(error.message, 'warning');
            throw error;
        } finally {
            this.salvando = false;
        }
    }
}
