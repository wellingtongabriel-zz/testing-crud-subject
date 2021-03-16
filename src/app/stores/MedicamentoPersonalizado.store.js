import { observable, action } from "mobx";

import Api from "../config/api";
import string from '../utils/string'


const defaultPageableDTO = {
  pageNumber: 0,
  pageSize: 20,
  sortDir: "ASC",
  sortField: "produto"
};

const defaultMedicamento = {
  id: null,
  produto: "",
  formaFarmaceutica: "",
  principioAtivo: ""
}

const defaultSearch = "";

export default class MedicamentoPersonalizadoStore {
  usuarioStore = null;

  // table states
  @observable last = false;
  @observable loading = true;

  @observable search = defaultSearch;
  @observable pageableDTO = {
    ...defaultPageableDTO
  };

  @observable elements = [];


  // modal states
  @observable open = false;
  @observable idOpened;
  
  @observable medicamento = {
    ...defaultMedicamento
  };

  @action closeModal() {
      this.open = false;
      this.medicamento = {
        ...defaultMedicamento
      };
  }

  @action async findAllMedicamentoPersonalizado(pageableDTO = {}) {
    try {      
      const pageable = {
        ...this.pageableDTO,
        ...pageableDTO
      };

      this.loading = true;

      const response = await Api.post("", {
          query: `
          query ($pageable: PageableDTOInput, $search: String) {
              findAllMedicamentoProfissionalSaudeAtual(pageableDTO: $pageable, search: $search) {
                last
                content {
                  id
                  produto
                  formaFarmaceutica
                  principioAtivo
                }
            }
          }`,
          variables: {
              pageable: {
                  ...defaultPageableDTO,
                  ...pageable
              },
              search: this.search || defaultSearch
          }
      });

      this.pageableDTO = {
        ...defaultPageableDTO,
        ...pageable
      };

      const { last, content } = response.data.data.findAllMedicamentoProfissionalSaudeAtual;

      this.last = last;

      if (this.pageableDTO.pageNumber > 0) {
        this.elements = [...this.elements, ...content];
      } else {
        this.elements = [...content];
      }
     
    } catch (error) {
      throw error;
    } finally {
      this.loading = false;
    }
  }

  @action async loadById(id) {
    try {
      this.idOpened = id;

      const response = await Api.post("", {
          query: `
          query ($id: UUID) {
            findByIdMedicamento(id: $id) {
                id
                produto
                formaFarmaceutica
                principioAtivo
            }
          }
                `,
          variables: {
              id: this.idOpened
          }
      });

      const medicamento = response.data.data.findByIdMedicamento;

      this.medicamento = {...medicamento};
     
    } catch (error) {
      throw error;
    } finally {
      this.loading = false;
    }
  }

  @action edit(id) {
    this.open = true;
    this.loadById(id);
  }

  @action openNew() {
    this.open = true;
    this.medicamento = {...defaultMedicamento};
  }

  @action async create() {
    const {id, ...newMedicamento} = this.medicamento;
    const queryCreate = `
      mutation ($medicamento: MedicamentoInput) {
        createMedicamento(medicamento: $medicamento) {
            id
        }
      }
    `;

    await this.save(queryCreate, newMedicamento);
  }

  @action async update() {
      const updatedMedicamento = {...this.medicamento};
      const queryUpdate = `
        mutation ($medicamento: MedicamentoInput) {
          updateMedicamento(medicamento: $medicamento) {
              id
          }
        }
      `;

      await this.save(queryUpdate, updatedMedicamento);
  }
  
  async save(query, medicamento) {
    try {
      if (string.isEmpty(medicamento.produto)) {
        throw new Error('Preencha os dados');
      }
      
      return Api.post("", {
        query,
        variables: { medicamento }
      });
    } catch (error) {
      throw error;
    }
  }
}
