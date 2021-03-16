import { action, observable } from "mobx";
import moment from 'moment';
import Api from '../../config/api';
import BaseStore from '../../stores/Base.store';
import string from "../../utils/string";

const defaultObjView = {
    nome: '',
    dataNascimento: null,
    cpf: '',
    telefonePrincipal: '',
    email: '',
    municipio: ''
};

const defaultSearchDTO = {
    pageNumber: 0,
    pageSize: 20,
    search: ''
};

export default class SujeitoAtencaoStore extends BaseStore {

    usuarioStore = null;
    erro = false;

    @observable open = false;
    @observable opening = false;
    @observable loading = true;
    @observable objView = { ...defaultObjView };
    @observable searchDTO = { ...defaultSearchDTO };
    @observable errors = {
        nome: false,
        dataNascimento: false,
        cpf: false,
        telefonePrincipal: false,
        email: false,
        municipio: false
    };
    @observable sujeitoAtencaoItems = [];
    @observable currentPage = null;
    @observable totalElements = 0;
    @observable numberOfElements = 0;

    async contemErros(formulario) {
        
        if (!formulario) {
            this.openNotification('Por favor, envie os dados do sujeito de atenção.', 'error');
            return true;
        }

        this.errors = {
            nome: false,
            dataNascimento: false,
            cpf: false,
            telefonePrincipal: false,
            email: false,
            municipio: false
        };

        this.error = false;

        if (string.isEmpty(formulario.nome)) {
            this.errors.nome = true;
            this.error = true;
        }

        if (formulario.dataNascimento === null) {
            this.errors.dataNascimento = true;
            this.error = true;
        }
        
        if (!string.validaCPF(formulario.cpf)) {
            this.errors.cpf = true;
            this.error = true;
        }

        if (this.error) {
            this.openNotification(`Por favor, corrija os campos abaixo:`, 'error');
            return true;
        }
      
        return false;
    }
    
    @action
    async findAll(searchDTO = {}) {
        try {

            if (this.currentPage === this.searchDTO.pageNumber) {
                return;
            } 

            this.currentPage = this.searchDTO.pageNumber;

            this.searchDTO = {
                ...this.searchDTO,
                ...searchDTO
            };

            this.loading = true;

            const response = await Api.post("", {
                query: `
                  query ($searchDTO: SearchSujeitoAtencaoDTOInput) {
                    findAllSujeitoAtencao(searchDTO: $searchDTO) {
                        totalElements
                        numberOfElements
                        content {
                            id
                            nome
                            cpf
                            dataNascimento
                            contato {
                                email
                                telefonePrincipal
                            }
                            endereco {
                                municipio {
                                    uf
                                    nome
                                }
                            }
                        }
                    }
                }`,
                variables: {
                    searchDTO: {
                        ...this.searchDTO,
                        ...searchDTO
                    }
                }
            });
    
            const { content, numberOfElements } = response.data.data.findAllSujeitoAtencao;

            this.numberOfElements = numberOfElements;
            this.searchDTO.pageNumber += 1;

            if (this.numberOfElements === 0 && string.isEmpty(this.searchDTO.search)) {
                return;
            }

            if(this.searchDTO.pageNumber > 1) {
                this.sujeitoAtencaoItems = [...this.sujeitoAtencaoItems, ...content];
            } else {
                this.sujeitoAtencaoItems = [...content];
            }
        } catch(error) {
            throw error;
        } finally {
            this.loading = false;
        }
    }

    @action
    async saveSujeitoAtencao() {
        try {

            if (await this.contemErros(this.objView)) {
                return;
            } 

            let sujeitoAtencao = { 
                id: this.objView.id,
                nome: this.objView.nome,
                cpf: string.removeSpecialChars(this.objView.cpf),
                dataNascimento: moment(this.objView.dataNascimento).format("YYYY-MM-DD"),
                contato: {
                    email: this.objView.email,
                    telefonePrincipal: string.removeSpecialChars(this.objView.telefonePrincipal)
                },
                endereco: {
                    municipio: {
                        id: this.objView.municipio
                    }
                }
            };

            const metodo = this.objView.id ? 'update' : 'create';
            await Api.post("",  {
                query: `
                    mutation ($sujeitoAtencao: SujeitoAtencaoInput) {
                        ${metodo}SujeitoAtencao(sujeitoAtencao: $sujeitoAtencao) {
                            id
                        }
                    }
                `,
                variables: { sujeitoAtencao }
            });

        } catch(error) {
            throw error;
        } finally {
            this.open = false; 
        }
    }

    @action 
    async loadById(id) {
        try {
            
            this.opening = true;
            const response = await Api.post("", {
            query: `
                query ($id: UUID) {
                    findByIdSujeitoAtencao(id: $id) {
                        id
                        nome
                        cpf
                        dataNascimento
                        contato {
                            email
                            telefonePrincipal
                        }
                        endereco {
                            municipio {
                                  id
                                uf
                                nome
                            }
                        }
                    }
                }
            `,
            variables: {
              id
            }
          });

          const data = response.data.data.findByIdSujeitoAtencao;
          
          this.objView = {
            id: data.id,
            nome: data.nome,
            cpf: string.cpfMask(data.cpf),
            dataNascimento: data.dataNascimento ?? null,
            email: data.contato?.email ?? "",
            telefonePrincipal: data.contato?.telefonePrincipal ?? "",
            municipio: data.endereco?.municipio?.id ?? ""
          };

        } catch (error) {
          throw error;
        } finally {
          this.opening = false;
        }
    }

    @action 
    edit(id) {
        this.open = true;
        this.loadById(id);
    } 

    @action 
    openNew() {
        this.open = true;
        this.objView = {
          ...defaultObjView
        };
    }

    @action 
    closeModal() {
        this.open = false;

        this.objView = {
          ...defaultObjView
        };
    } 
}