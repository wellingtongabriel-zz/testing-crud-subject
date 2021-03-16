import {action, observable} from 'mobx';
import localStorageService, {USUARIO_LOGADO_KEY, REDES_KEY} from '../services/storage';
import {AuthApi, NestorApi} from "../config/api"
import string from "../utils/string";

export default class UsuarioStore {
    @observable isAuthenticated = false;

    @observable mudarSenhaModalOpen = false;

    @observable mudarSenha = {
        senhaAtual: '',
        novaSenha: '',
        confirmarNovaSenha: ''
    };

    @observable errors = {
        senhaAtual: false,
        novaSenha: false,
        confirmarNovaSenha: false
    };

    @observable notification = {
        isOpen: false,
        variant: '',
        message: ''
    };

    @observable disableButtons = true;

    @observable fotoPerfil = null;

    @action verificaNovaSenha() {
        if ((this.mudarSenha.novaSenha !== undefined && this.mudarSenha.novaSenha !== '') &&
            (this.mudarSenha.confirmarNovaSenha !== undefined && this.mudarSenha.confirmarNovaSenha !== '')) {
            this.disableButtons = !(this.mudarSenha.novaSenha === this.mudarSenha.confirmarNovaSenha);
        }
    };

    @action openMudarSenhaModal() {
        this.mudarSenhaModalOpen = true;
    }

    @action closeMudarSenhaModal() {
        this.resetCampos();
        this.mudarSenhaModalOpen = false;
    }

    @action resetCampos(){
        this.mudarSenha = {
            senhaAtual: '',
            novaSenha: '',
            confirmarNovaSenha: ''
        }
    }

    @action
    async getUsuarioLogado() {
        return localStorageService.get(USUARIO_LOGADO_KEY);
    }

    @action
    async getRedes() {
        return localStorageService.get(REDES_KEY);
    }

    @action
    async getUnidadeAtual() {
        try {
            const usuarioLogado = await this.getUsuarioLogado();

            return usuarioLogado?.unidadeAtual;
        } catch (error) {
            console.error(error);
        }
    }

    @action
    async getProfissionalSaudeAtual() {
        try {
            const usuarioLogado = await this.getUsuarioLogado();
            return usuarioLogado?.profissionalSaudeAtual;
        } catch (error) {
            console.error(error);
        }
    }

    @action
    async getUnidades() {
        try {
            const redes = await this.getRedes();
            let unidades = [];

            if (redes && redes.length > 1) {
                redes.forEach(rede => {
                    unidades = unidades.concat(rede.unidades);
                });
            } else {
                const unidadeAtual = await this.getUnidadeAtual();
                unidades.push(unidadeAtual);
            }

            return unidades;
        } catch (error) {
            console.error(error);
        }
    }

    @action
    async alterarSenha() {
        if (!this.contemErros()) {
            try {
                AuthApi.post('graphql', {
                        query: `
                            mutation($senhaAtual: String, $novaSenha: String){
                              alterarSenhaUsuario(senhaAtual: $senhaAtual, novaSenha: $novaSenha){
                                id
                              }
                            }`,
                        variables: {
                            senhaAtual: this.mudarSenha.senhaAtual,
                            novaSenha: this.mudarSenha.novaSenha
                        }
                    }
                ).then((result) => {
                    const {alterarSenhaUsuario} = result.data.data;
                    if (alterarSenhaUsuario) {
                        this.openNotification('Senha alterada com sucesso.', 'success');
                        this.closeMudarSenhaModal();
                    } else {
                        this.openNotification('Erro ao alterar a senha, verifique a senha atual!.', 'error');
                    }
                });
            } catch (error) {
                throw error;
            }
        } else {
            this.openNotification('Campos obrigatórios não foram preenchidos!', 'error')
        }
    }

    @action 
    async updateImagemPerfil(fotoPerfilId) {
        if (!fotoPerfilId) return false;
        this.fotoPerfil = fotoPerfilId
        return true;
    }


    @action
    async salvarImagem(file) {
        this.openNotification("Salvando imagem...", "info");
        const result = await this.saveFile(file);
        const data = await result.data;
        let retorno = false;

        if (data) {
            const syncResult = await this.syncImageChanged(data);
            const dataResult = await syncResult.data;
            if (dataResult) {
                const usuarioLogado = dataResult.data.alterarFotoPerfilUsuarioLogado;
                retorno = await this.updateImagemPerfil(data.id)
                localStorageService.set(USUARIO_LOGADO_KEY, usuarioLogado);
            } 
        } 

        if (retorno) {
            this.openNotification('Imagem alterada com sucesso.', 'success');
        } else {
            this.openNotification('Erro ao salvar a nova imagem. Tente novamente!', 'error')
        }

        return retorno;
    }

    async saveFile(file) {
        if (file) {
            try {
                const formData = new FormData();
                formData.append('file', file);                
                return NestorApi.post('/resource/AppHealth',formData);
            } catch (error) {
                throw error;
            }
        } 
    } 

    async syncImageChanged(fotoPerfil) {
        if (fotoPerfil && fotoPerfil.id) {
            return AuthApi.post('graphql', {
                query: `
                    mutation($fotoPerfilId: UUID){
                        alterarFotoPerfilUsuarioLogado(fotoPerfilId: $fotoPerfilId){
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
                    }`,
                variables: {
                    fotoPerfilId: fotoPerfil.id
                }
            })
        }
    }

    contemErros() {
        this.errors = {
            senhaAtual: string.isEmpty(this.mudarSenha.senhaAtual),
            novaSenha: string.isEmpty(this.mudarSenha.novaSenha),
            confirmarNovaSenha: string.isEmpty(this.mudarSenha.confirmarNovaSenha)
        };

        return this.errors.senhaAtual || this.errors.novaSenha || this.errors.confirmarNovaSenha;
    }

    closeNotification = () => {
        this.notification.message = '';
        this.notification.variant = '';
        this.notification.isOpen = false;
    };

    resetNotification = () => {
        this.notification.message = '';
        this.notification.variant = '';
        this.notification.isOpen = false;
    };

    openNotification = (message, variant) => {
        this.notification.message = message;
        this.notification.variant = variant;
        this.notification.isOpen = true;
    };
}
