import { observable, action } from "mobx";

import Api from "../../config/api";
import string from "../../utils/string";

const defaultObjView = {
  id: null,
  nome: null,
  unidade: null
};

const defaultSearchDTO = {
  pageNumber: 0,
  pageSize: 20,
  search: ''
};

export default class CentroDeCustoStore {
  usuarioStore = null;
  @observable currentPage = null;
  @observable totalElements = 0;
  @observable numberOfElements = 0;
  @observable loading = true;
  @observable saving = false;
  @observable opening = false;
  @observable open = false;
  @observable centroCustoList = [];
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
                        findAllCentroCusto(searchDTO: $searchDTO) {
                            totalElements
                            numberOfElements
                            content {
                                id
                                nome
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

      const list = response.data.data.findAllCentroCusto.content;
      this.numberOfElements = response.data.data.findAllCentroCusto.numberOfElements;
      this.searchDTO.pageNumber += 1;
      
      if (this.numberOfElements === 0 && string.isEmpty(this.searchDTO.search)) {
        return;
      }
      
      if(this.searchDTO.pageNumber > 1) {
        this.centroCustoList = [...this.centroCustoList, ...list];
      } else {
        this.centroCustoList = [...list];
      }
    } catch (error) {
      throw error;
    } finally {
      this.loading = false;
    }
  }

  @action async save(centroCusto) {
    try {
      if (this.saving) {
        return;
      }

      if (!centroCusto) {
        return;
      }

      if (centroCusto && string.isEmpty(centroCusto.nome)) {
        return;
      }

      let metodo = "create";
      if (centroCusto && centroCusto.id) {
        metodo = "update";
      }

      const usuarioLogado = await this.usuarioStore.getUsuarioLogado();

      const unidadeId = usuarioLogado.unidadeAtual.id;

      this.saving = true;
      await Api.post("", {
        query: `
                    mutation ($centroCusto: CentroCustoInput) {
                        ${metodo}CentroCusto(centroCusto: $centroCusto) {
                            id
                        }
                    }
                `,
        variables: {
          centroCusto: {
            ...centroCusto,
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
                findByIdCentroCusto(id: $id) {
                    id
                    nome
                }
            }
        `,
        variables: {
          id
        }
      });

      this.objView = response.data.data.findByIdCentroCusto;
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
