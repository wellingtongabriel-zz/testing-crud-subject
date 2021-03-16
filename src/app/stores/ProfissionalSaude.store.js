import {action, observable} from 'mobx';
import Api, {AuthApi} from '../config/api';
import {createMutation} from "../pages/Querys";
import string from "../utils/string";
import moment from "moment"
import localStorageService, {ACCESS_TOKEN_KEY, USUARIO_LOGADO_KEY} from '../services/storage';

const profissionalSaudeDefault = {
    id: '',
    nome: '',
    cpf: '',
    cns: '',
    ativo: '',
    dataNascimento: '',
    numeroConselho: '',
    ufConselho: {value: "", name: ""},
    possuiAgenda: '',
    utilizaAssinaturaDigital: false,
    usuario: {
        email: '',
        fotoPerfil: '',
    }
};

export default class ProfissionalSaudeStore {
    @observable profissionalSaude = profissionalSaudeDefault;
    @observable estadosList = [];

    @observable notification = {
        isOpen: false,
        variant: '',
        message: ''
    };

    @observable errors = {
        cpf: false,
        nome: false,
        cns: false,
        numeroConselho: false,
        email: false,
        dataNascimento: false
    };

    @observable profissionaisSaudeUnidade = [];

    @action async findByUnidadeComAgenda(unidadeId) {
        try {
            const { data } = await Api.post('',
                {
                    query: `
                        query {
                            query: findProfissionalSaudeByUnidadeComAgenda(unidadeId: ${unidadeId}) {
                                id
                                nome
                                cns
                                cpf
                            }
                        }
                        `
                }
            );

            if(data.errors) {
                throw data.errors[0];
            }

            return data.data.query;
        } catch (error) {
            throw error;
        }
    }

    @action async findByUnidadeSemAgenda(unidadeId) {
        try {
            const { data } = await Api.post('',
                {
                    query: `
                        query {
                            query: findProfissionalSaudeByUnidadeSemAgenda(unidadeId: ${unidadeId}) {
                                id
                                nome
                                cns
                                cpf
                                usuario {
                                    id
                                    nome
                                }
                            }
                        }
                        `
                }
            );

            if(data.errors) {
                throw data.errors[0];
            }

            return data.data.query;
        } catch (error) {
            throw error;
        }
    }

    @action async carregaProfissionalSaude(){
        try {
            const { data } = await AuthApi.post('graphql',
                {
                    query: `{
                        obterDadosUsuarioLogado {
                            usuarioLogado {
                                id
                                nome
                                login
                                fotoPerfil
                                email
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
                                    id
                                    ativo
                                    cns
                                    cpf
                                    dataNascimento
                                    nome
                                    numeroConselho
                                    possuiAgenda
                                    ufConselho
                                    utilizaAssinaturaDigital
                                }
                                authorities {
                                    authority
                                }
                            }
                        }
                    }`
                }
            );

            if(data.errors) {
                throw data.errors[0];
            }


            const {usuarioLogado} = data.data.obterDadosUsuarioLogado;
            this.profissionalSaude = usuarioLogado.profissionalSaudeAtual;

            //console.log('usuarioLogado',usuarioLogado);

            this.profissionalSaude = {
                ...this.profissionalSaude,
                usuario: {
                    email: usuarioLogado.email,
                    fotoPerfil: usuarioLogado.fotoPerfil
                }
            };

            //console.log('profissionalSaude', this.profissionalSaude);
            this.profissionalSaude.dataNascimento = this.profissionalSaude.dataNascimento ? moment(this.profissionalSaude.dataNascimento, 'YYYY-MM-DD') : null;
            await localStorageService.set(USUARIO_LOGADO_KEY, usuarioLogado);
        } catch (error) {
            throw error;
        }
    }

    @action async updateProfissionalSaudeLogado(){
        if(!this.contemErros()) {
            try {
                Api.post('',
                    JSON.stringify({
                        query: createMutation({
                            name: 'updateProfissionalSaudeLogado',
                            objType: 'ProfissionalSaudeInput',
                            objName: 'profissionalSaude',
                            attrsReturn: `
                            id
                            ativo
                            cns
                            cpf
                            dataNascimento
                            nome
                            numeroConselho
                            possuiAgenda
                            ufConselho
                            utilizaAssinaturaDigital
                            usuario {
                              email,
                              fotoPerfil
                            }`
                        }, 'mutation'),
                        variables: {
                            profissionalSaude: {
                                ...this.profissionalSaude,
                                cpf: string.removeSpecialChars(this.profissionalSaude.cpf),
                                dataNascimento: moment(this.profissionalSaude.dataNascimento)?.isValid() ?
                                    moment(this.profissionalSaude.dataNascimento, 'DD/MM/YYYY').format('YYYY-MM-DD')
                                    : this.profissionalSaude.dataNascimento
                            }
                        }
                    })
                ).then((result) => {
                    const {updateProfissionalSaudeLogado} = result.data.data;
                    if (updateProfissionalSaudeLogado) {

                        this.profissionalSaude = updateProfissionalSaudeLogado;

                        //console.log('updateProfissionalSaudeLogado', updateProfissionalSaudeLogado);

                        this.profissionalSaude = {
                            ...this.profissionalSaude,
                            usuario: {
                                email: updateProfissionalSaudeLogado.usuario?.email,
                                fotoPerfil: updateProfissionalSaudeLogado.usuario?.fotoPerfil
                            }
                        };

                        //console.log('profissionalSaude', this.profissionalSaude);

                        this.profissionalSaude.dataNascimento = this.profissionalSaude.dataNascimento ? moment(this.profissionalSaude.dataNascimento, 'YYYY-MM-DD') : null;
                        this.openNotification('Cadastro atualizado com sucesso.', 'success');
                    } else {
                        this.openNotification('Erro ao atualizar cadastro.', 'error');
                    }
                });
            } catch (error) {
                throw error;
            }
        }else{
            this.openNotification('Campos obrigatórios não foram preenchidos!', 'error')
        }
    }

    @action
    async getEstadoList() {
        Api.post('', {
            query: `{
                        findAllEstadoList {
                          value: uf
                          name: uf
                        }
                    }
                `
        }).then((result) => {
            const {findAllEstadoList} = result.data.data;

            this.estadosList = findAllEstadoList;
        });
    }

    async getAccessToken() {
        return await localStorageService.get(ACCESS_TOKEN_KEY);
    }

    contemErros(){

        this.errors = {
            cpf: string.isEmpty(this.profissionalSaude.cpf) ? false : !string.validaCPF(this.profissionalSaude.cpf),
            nome: string.isEmpty(this.profissionalSaude.nome),
            cns: string.isEmpty(this.profissionalSaude.cns),
            numeroConselho: string.isEmpty(this.profissionalSaude.numeroConselho),
            dataNascimento: this.profissionalSaude.dataNascimento === undefined || this.profissionalSaude.dataNascimento === null
        };

        return this.errors.nome || this.errors.telefone || this.errors.cns
            || this.errors.dataNascimento || (this.profissionalSaude.possuiAgenda ? this.errors.numeroConselho : false);
    };

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
