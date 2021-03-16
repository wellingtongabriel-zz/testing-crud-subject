import { action, observable } from "mobx";
import Api from "../../config/api";
import string from "../../utils/string";


export const CategoriaFinanceiraTipo = {
  DESPESA: 'DESPESA',
  RECEITA: 'RECEITA',
};

const defaultObjView = {
  id: null,
  tipo: CategoriaFinanceiraTipo.DESPESA,
  categoriaFinanceiraPai: null,
  nome: null,
  unidade: null
};

const defaultSearchDTO = {
  pageNumber: 0,
  pageSize: 20,
  search: ''
};

export default class CategoriaFinanceiraStore {
  usuarioStore = null;
  @observable currentPage = null;
  @observable totalElements = 0;
  @observable numberOfElements = 0;
  @observable loading = true;
  @observable saving = false;
  @observable opening = false;
  @observable open = false;
  @observable categoriaFinanceiraList = [];
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
          query ($searchDTO: SearchFinanceiroDTOInput) {
            findAllCategoriaFinanceira(searchDTO: $searchDTO) {
              totalElements
              numberOfElements
              content {
                id
                nome
                tipo
                categoriasFinanceiras {
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

      const list = response.data.data.findAllCategoriaFinanceira.content;
      this.numberOfElements = response.data.data.findAllCategoriaFinanceira.numberOfElements;
      this.searchDTO.pageNumber += 1;
      
      if (this.numberOfElements === 0 && string.isEmpty(this.searchDTO.search)) {
        return;
      }
      
      if(this.searchDTO.pageNumber > 1) {
        this.categoriaFinanceiraList = [...this.categoriaFinanceiraList, ...list];
      } else {
        this.categoriaFinanceiraList = [...list];
      }
    } catch (error) {
      throw error;
    } finally {
      this.loading = false;
    }
  }
  
  @action async findCategoriasFinanceirasPais(searchDTO = {}, categoriaFinanceiraTipo) {
    try {
      const defaultSearchDTO = {
        pageSize: 20,
        pageNumber: 0,
        sortDir: "ASC",
        sortField: "nome"
      };
      
      const response = await Api.post("", {
        query: `
          query ($searchDTO: SearchFinanceiroDTOInput) {
            findAllCategoriaFinanceira(searchDTO: $searchDTO) {
              last
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
            ...defaultSearchDTO,
            ...searchDTO,
            categoriaFinanceiraTipo
          }
        }
      });

      const { last, content } = response.data.data.findAllCategoriaFinanceira;
      
      const customContent = content.map(c => ({
        ...c,
        value: c.id,
        label: c.nome
      }));
      
      return {
        last,
        content: customContent,
      };
    } catch (error) {
      throw error;
    }
  }

  @action async save(categoriaFinanceira) {
    try {
      if (this.saving) {
        return;
      }

      if (!categoriaFinanceira) {
        throw new Error('Preencha os dados');
      }

      if (
        string.isEmpty(categoriaFinanceira.nome) ||
        string.isEmpty(categoriaFinanceira.tipo)
      ) {
        throw new Error('Preencha os dados');
      }
      
      const categoriaFinanceiraDados = {
        tipo: categoriaFinanceira.tipo,
        nome: categoriaFinanceira.nome,
      };

      let metodo = "create";
      if (categoriaFinanceira.id) {
        categoriaFinanceiraDados.id = categoriaFinanceira.id;
        metodo = "update";
      }
      
      if (categoriaFinanceira.categoriaFinanceiraPai && categoriaFinanceira.categoriaFinanceiraPai.id) {
        categoriaFinanceiraDados.categoriaFinanceiraPai = {
          id: categoriaFinanceira.categoriaFinanceiraPai.id
        };
      }

      const usuarioLogado = await this.usuarioStore.getUsuarioLogado();

      const unidadeId = usuarioLogado.unidadeAtual.id;
      
      this.saving = true;
      await Api.post("", {
        query: `
          mutation ($categoriaFinanceira: CategoriaFinanceiraInput) {
              ${metodo}CategoriaFinanceira(categoriaFinanceira: $categoriaFinanceira) {
                  id
              }
          }
        `,
        variables: {
          categoriaFinanceira: {
            ...categoriaFinanceiraDados,
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
                findByIdCategoriaFinanceira(id: $id) {
                    id
                    nome
                    tipo
                    categoriaFinanceiraPai {
                      id
                      nome
                    }
                }
            }
        `,
        variables: {
          id
        }
      });

      const data = response.data.data.findByIdCategoriaFinanceira;
      const { categoriaFinanceiraPai } = data;
      
      if (categoriaFinanceiraPai && categoriaFinanceiraPai.id) {
        categoriaFinanceiraPai.value = categoriaFinanceiraPai.id;
        categoriaFinanceiraPai.label = categoriaFinanceiraPai.nome;
      }
      
      this.objView = {
        ...data,
        categoriaFinanceiraPai: categoriaFinanceiraPai || null,
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
