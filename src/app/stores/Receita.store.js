import { action } from "mobx";
import Api from "../config/api";

export default class ReceitaStore {
  @action async loadMedicamentos(search, callback) {
    try {
      const { data } = await Api.post("", {
        query: `
            query($searchDTO: SearchDTOInput) {
                findAllMedicamento(searchDTO: $searchDTO) {
                    totalElements,
                    size,
                    content {
                        id
                        principioAtivo
                        produto
                        formaFarmaceutica
                        subtitulo
                        tipo
                        tarja
                        fabricante
                    }
                }
            }
                `,
        variables: {
          searchDTO: {
            search: search.toLowerCase(),
            pageNumber: 0,
            pageSize: 30,
            sortField: 'profissionalSaude',
            sortDir: 'ASC'
          }
        }
      });

      if (data.errors) {
        throw data.errors[0];
      }

      const { content } = data.data.findAllMedicamento;
      const medicamentos = content
        ? content.map(c => ({ 
            ...c,
            value: c.id, 
            label: `${c.produto}${c.subtitulo ? `, ${c.subtitulo}` : ''}`
        }))
        : [];

      callback(medicamentos);
    } catch (error) {
      throw error;
    }
  }
  
  @action async findAllProfissionalSaudeAdscricao(searchDTO = {}) {
    try {
      if (!searchDTO?.medicamentoId) {
        throw new Error('Informe um medicamento');
      }
      
      const { data } = await Api.post("", {
        query: `
                    query($searchDTO: SearchProfissionalSaudeAdscricaoDTOInput) {
                      findAllProfissionalSaudeAdscricao(searchDTO: $searchDTO) {
                        id
                        adscricao
                      }
                    }
                `,
        variables: {
          searchDTO: {
            ...searchDTO
          }
        }
      });

      if (data.errors) {
        throw data.errors[0];
      }

      const result = data.data.findAllProfissionalSaudeAdscricao;
      const adscricaoList = result
        ? result.map(c => ({ 
            ...c,
            value: c.id, 
            label: c.adscricao
        }))
        : [];

      return adscricaoList;
    } catch (error) {
      throw error;
    }
  }
}
