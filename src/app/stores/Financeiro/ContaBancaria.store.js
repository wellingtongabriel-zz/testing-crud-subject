import { observable, action } from "mobx";

import Api from "../../config/api";
import string from "../../utils/string";

const defaultObjView = {
  id: null,
  nome: null,
  saldoInicial: 0,
  banco: null,
  unidade: null
};

const defaultSearchDTO = {
  pageNumber: 0,
  pageSize: 20,
  search: ''
};

export default class ContaBancariaStore {
  usuarioStore = null;
  @observable currentPage = null;
  @observable totalElements = 0;
  @observable numberOfElements = 0;
  @observable loading = true;
  @observable saving = false;
  @observable opening = false;
  @observable open = false;
  @observable contaBancariaList = [];
  @observable objView = {
    ...defaultObjView
  };
  @observable searchDTO = {
    ...defaultSearchDTO
  }

  @action async findAll(searchDTO = {}) {
    try {
      if (this.currentPage === this.searchDTO.pageNumber) {
        return;
      }
      
      this.currentPage = this.searchDTO.pageNumber;
      
      const usuarioLogado = await this.usuarioStore.getUsuarioLogado();

      const unidadeId = usuarioLogado.unidadeAtual.id;

      this.searchDTO = {
        ...this.searchDTO,
        ...searchDTO
      };
      this.loading = true;
      
      const response = await Api.post("", {
        query: `
          query ($searchDTO: SearchDTOInput) {
              findAllContaBancaria(searchDTO: $searchDTO) {
                  totalElements
                  numberOfElements
                  content {
                      id
                      nome
                      saldoInicial
                      banco {
                        id
                        nome
                      }
                  }
              }
          }
                `,
        variables: {
          searchDTO: {
            ...this.searchDTO,
            ...searchDTO,
            unidadeId
          }
        }
      });

      const list = response.data.data.findAllContaBancaria.content;
      this.numberOfElements = response.data.data.findAllContaBancaria.numberOfElements;
      this.searchDTO.pageNumber += 1;
      
      if (this.numberOfElements === 0 && string.isEmpty(this.searchDTO.search)) {
        return;
      }
      
      if(this.searchDTO.pageNumber > 1) {
        this.contaBancariaList = [...this.contaBancariaList, ...list];
      } else {
        this.contaBancariaList = [...list];
      }
    } catch (error) {
      throw error;
    } finally {
      this.loading = false;
    }
  }
  
  @action async findAllBanco(searchDTO = {}) {
    try {
      const defaultSearchDTO = {
        pageSize: 30,
        pageNumber: 0,
        sortDir: "ASC",
        sortField: "codigo"
      };
      
      const response = await Api.post("", {
        query: `
          query ($searchDTO: SearchDTOInput, $pageableDTO: PageableDTOInput) {
            findAllBanco(searchDTO: $searchDTO, pageableDTO: $pageableDTO) {
              last
              totalElements
              numberOfElements
              content {
                id
                nome
                codigo
              }
            }
          }
                `,
        variables: {
          searchDTO: {
            ...searchDTO
          },
          pageableDTO: defaultSearchDTO
        }
      });

      const { last, content } = response.data.data.findAllBanco;
      
      const customContent = content.map(c => ({
        ...c,
        value: c.id,
        label: `${c.codigo} - ${c.nome}`
      }));
      
      return {
        last,
        content: customContent,
      };
    } catch (error) {
      throw error;
    }
  }

  @action async save(contaBancaria) {
    try {
      if (this.saving) {
        return;
      }

      if (!contaBancaria) {
        throw new Error('Preencha os dados');
      }

      if (
        string.isEmpty(contaBancaria.nome) ||
        !contaBancaria.banco ||
        string.isEmpty(contaBancaria.saldoInicial)
      ) {
        throw new Error('Preencha os dados');
      }

      let metodo = "create";
      if (contaBancaria.id) {
        metodo = "update";
      }

      const usuarioLogado = await this.usuarioStore.getUsuarioLogado();

      const unidadeId = usuarioLogado.unidadeAtual.id;

      this.saving = true;
      await Api.post("", {
        query: `
          mutation ($contaBancaria: ContaBancariaInput) {
              ${metodo}ContaBancaria(contaBancaria: $contaBancaria) {
                  id
              }
          }
        `,
        variables: {
          contaBancaria: {
            ...contaBancaria,
            saldoInicial: string.currencyMaskToFloat(contaBancaria.saldoInicial),
            banco: {
              id: contaBancaria.banco.id,
            },
            unidade: {
              id: unidadeId
            }
          }
        }
      });
    } catch (error) {
      throw error;
    } finally {
      this.saving = false;
    }
  }

  @action edit(id) {
    this.open = true;
    this.loadById(id);
  }

  @action openNew() {
    this.open = true;
    this.objView = {
      ...defaultObjView
    };
  }

  @action async loadById(id) {
    try {
      this.opening = true;
      const response = await Api.post("", {
        query: `
            query ($id: Long) {
                findByIdContaBancaria(id: $id) {
                    id
                    nome
                    saldoInicial
                    banco {
                      id
                      nome
                      codigo
                    }
                }
            }
        `,
        variables: {
          id
        }
      });

      const data = response.data.data.findByIdContaBancaria;
      
      this.objView = {
        ...data,
        banco: {
          ...data.banco,
          value: data.banco.id,
          label: `${data.banco.codigo} - ${data.banco.nome}`
        },
        saldoInicial: parseFloat(data.saldoInicial).toFixed(2).replace('.', ',')
      };
    } catch (error) {
      throw error;
    } finally {
      this.opening = false;
    }
  }

  @action closeModal() {
    this.open = false;
    this.objView = {
      ...defaultObjView
    };
  }
}
