import {action, observable} from "mobx";
import Api from "../config/api";
import {createMutation} from "../pages/Querys";
import string from "../utils/string";

const unidadeDefault = {
    id: '',
    nome: '',
    nomeFantasia: '',
    codigoCnes: '',
    telefonePrincipal: '',
    endereco: {
        cep: '',
        nomeLogradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        estado: {
            id: '',
            nome: ''
        },
        municipio: {
            id: '',
            nome: ''
        }
    }
};

export default class unidadeStore {

    @observable unidade = unidadeDefault;

    @observable estados = [];

    @observable municipios = [];

    @observable objView = {
        estado: null,
        municipio: null
    };

    @observable notification = {
        isOpen: false,
        variant: '',
        message: ''
    };

    @observable errors = {
        nome: false,
        nomeFantasia: false,
        codigoCnes: false,
        telefonePrincipal: false,
        endereco: false,
        cep: false,
        bairro: false,
        nomeLogradouro: false,
        numero: false,
        estado: false,
        municipio: false
    };

    @action
    async getUnidadeLogada() {
        Api.post('', {
            query: `{
                        findUnidadeLogada{
                            id
                            nome
                            nomeFantasia
                            codigoCnes
                            telefonePrincipal
                            endereco {
                                cep
                                nomeLogradouro
                                numero
                                complemento
                                bairro
                                estado {
                                    id
                                    nome
                                }
                                municipio {
                                    id
                                    nome
                                }
                            }
                        }
                        
                        findAllEstadoList {
                          id
                          uf
                          nome
                        }
                    }
                `
        }).then((result) => {
            const {findUnidadeLogada, findAllEstadoList} = result.data.data;
            if (findUnidadeLogada) {
                this.unidade = findUnidadeLogada;
                this.estados = findAllEstadoList.map(e => ({
                    value: e.id,
                    name: string.capitalize(e.nome)
                }));
                this.initObjView();
            } else {
                this.openNotification('Erro ao carregar os dados da unidade.', 'error');
            }

        });
    }

    initObjView() {
        this.objView.estado = this.unidade.endereco && this.unidade.endereco.estado ? {
            value: this.unidade.endereco.estado.id,
            label: this.unidade.endereco.estado.nome
        } : null;
        this.objView.municipio = this.unidade.endereco && this.unidade.endereco.municipio ? {
            value: this.unidade.endereco.municipio.id,
            label: this.unidade.endereco.municipio.nome
        } : null;

        if (this.objView.estado) {
            this.getMunicipioByEstado(this.objView.estado.value);
        }
    }

    @action
    async updateUnidadeLogada() {
        if (!this.contemErros()) {
            try {
                Api.post('',
                    JSON.stringify({
                        query: createMutation({
                            name: 'updateUnidadeLogada',
                            objType: 'UnidadeInput',
                            objName: 'unidade',
                            attrsReturn: `
                            id
                            nome
                            codigoCnes
                            telefonePrincipal
                            endereco {
                              cep
                              nomeLogradouro
                              numero
                              complemento
                              bairro
                              estado {
                                id
                                nome
                                uf
                              }
                              municipio {
                                id
                                nome
                              }
                            }
                            `
                        }, 'mutation'),
                        variables: {
                            unidade: {
                                ...this.unidade,
                                telefonePrincipal: string.removeSpecialChars(this.unidade.telefonePrincipal),
                                endereco: {
                                    ...this.unidade.endereco,
                                    cep: string.removeSpecialChars(this.unidade?.endereco?.cep),
                                    estado: {
                                        id: this.objView.estado?.value || null
                                    },
                                    municipio: {
                                        id: this.objView.municipio?.value || null
                                    }
                                }
                            }
                        }
                    })
                ).then((result) => {
                    const {updateUnidadeLogada} = result.data.data;
                    if (updateUnidadeLogada) {
                        this.openNotification('Cadastro atualizado com sucesso, por favor entre no sistema novamente.', 'success');
                    } else {
                        this.openNotification('Erro ao atualizar cadastro.', 'error');
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
    async getEstadosList() {
        Api.post('', {
            query: `
            {
              findAllEstadoList {
                id
                uf
                nome
              }
            }
        `
        }).then((result) => {
            const {findAllEstadoList} = result.data.data;
            if (findAllEstadoList) {
                this.estados = findAllEstadoList.map(e => ({
                    value: e.id,
                    name: string.capitalize(e.nome)
                }));
            } else {
                this.openNotification('Erro ao carregar os estados.', 'error');
            }
        });
    }

    @action
    async getMunicipioByEstado(idEstado) {
        Api.post('', {
            query: `
                {
                  findByEstado(estado: {id: ${idEstado}}){
                    id
                    nome
                  }
                }           
            `
        }).then((result) => {
            const {findByEstado} = result.data.data;
            if (findByEstado) {
                this.municipios = findByEstado.map(m => ({
                    value: m.id,
                    name: string.capitalize(m.nome)
                }));
            } else {
                this.openNotification('Erro ao carregar os municipios.', 'error');
            }
        });
    }

    contemErros() {

        this.errors = {
            nome: string.isEmpty(this.unidade.nome),
            nomeFantasia: string.isEmpty(this.unidade.nomeFantasia),
            codigoCnes: string.isEmpty(this.unidade.codigoCnes),
            telefonePrincipal: string.isEmpty(this.unidade.telefonePrincipal),
            cep: string.isEmpty(this.unidade.endereco.cep),
            bairro: string.isEmpty(this.unidade.endereco.bairro),
            nomeLogradouro: string.isEmpty(this.unidade.endereco.nomeLogradouro),
            numero: string.isEmpty(this.unidade.endereco.numero),
            estado: this.objView.estado === undefined || this.objView.estado === null,
            municipio: this.objView.municipio === undefined || this.objView.estado === null

        };

        return this.errors.nome || this.errors.nomeFantasia || this.errors.codigoCnes || this.errors.telefonePrincipal
            || this.errors.cep || this.errors.bairro || this.errors.nomeLogradouro ||
            this.errors.numero || this.errors.estado || this.errors.municipio;
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