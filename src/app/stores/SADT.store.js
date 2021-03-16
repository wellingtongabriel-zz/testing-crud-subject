import { action, observable } from "mobx";
import Api from "../config/api";
import BaseStore from "./Base.store";

const defaultObjView = {
  indicacaoClinica: null,
  tabela: '',
  codigoTermo: '',
  descricao: null,
  quantidadeSolicitada: 1,
  guiaServicoTussViews: [],
  sujeitoAtencao: null,
};

export default class SADTStore extends BaseStore {
  @observable objView = {
    ...defaultObjView
  }

  @observable loadingButtonImpressao = false;
  @observable printing = false;
  @observable saving = false;
  @observable readOnly = false;
  @observable guiaServico = null;
  @observable entradaProntuario = null;
  
  @observable notification = {
    isOpen: false,
    variant: '',
    message: ''
  };

  @action async findAllCid10Subcategoria(searchDTO = {}) {
    try {
      const defaultSearchDTO = {
        pageSize: 30,
        pageNumber: 0,
        sortDir: "ASC",
        sortField: "descricaoAbreviada"
      };

      const response = await Api.post("", {
        query: `
          query ($searchDTO: SearchDTOInput) {
            findAllCid10Subcategoria(searchDTO: $searchDTO) {
              last
              totalElements
              numberOfElements
              content {
                id
                descricaoAbreviada
              }
            }
          }
                `,
        variables: {
          searchDTO: {
            ...defaultSearchDTO,
            ...searchDTO
          }
        }
      });

      const { last, content } = response.data.data.findAllCid10Subcategoria;

      const customContent = content.map(c => ({
        ...c,
        value: c.id,
        label: c.descricaoAbreviada
      }));

      return {
        last,
        content: customContent
      };
    } catch (error) {
      throw error;
    }
  }

  @action async findAllTussView(searchDTO = {}, field) {
    try {
      const defaultSearchDTO = {
        pageSize: 30,
        pageNumber: 0,
        sortDir: "ASC",
        sortField: "descricao"
      };

      const response = await Api.post("", {
        query: `
          query ($searchDTO: SearchDTOInput) {
            findAllTussView(searchDTO: $searchDTO) {
              last
              totalElements
              numberOfElements
              content {
                codigoTermo
                descricao
                tabela
              }
            }
          }
                `,
        variables: {
          searchDTO: {
            ...defaultSearchDTO,
            ...searchDTO
          }
        }
      });

      const { last, content } = response.data.data.findAllTussView;

      const customContent = content.map(c => ({
        ...c,
        value: c[field],
        label: c[field]
      }));

      return {
        last,
        content: customContent
      };
    } catch (error) {
      throw error;
    }
  }

  @action async createGuiaServico(input) {
    try {
      if (!input.sujeitoAtencao?.id) {
        throw new Error("Informe o Sujeito de Atenção");
      }
      if (!input.indicacaoClinica?.value) {
        throw new Error("Informe a indicação clínica");
      }
      if (!input.guiaServicoTussViews?.length) {
        throw new Error("Informe o guia de serviço Tuss");
      }

      const query = `
        mutation ($guiaServico: GuiaServicoInput) {
          createGuiaServico(guiaServico: $guiaServico) {
            beneficiarioCns
            beneficiarioConvenioNumeroCarteira
            beneficiarioConvenioValidadeCarteira
            beneficiarioNome
            cid10Subcategoria {
              descricaoAbreviada
            }
            dataHoraLancamento
            solicitanteNome
            guiaServicoTussViews {
              quantidadeSolicitada
              tussView {
                codigoTermo
                descricao
                tabela
              }
            }
          }
        }
      `;
      const variables = {
        guiaServico: {
          cid10Subcategoria: {
            id: input.indicacaoClinica.value
          },
          sujeitoAtencao: {
            id: input.sujeitoAtencao.id
          },
          guiaServicoTussViews: input.guiaServicoTussViews
        }
      };
      
      this.saving = true;
      const response = await Api.post("", {
        query,
        variables
      });

      if (response.data.errors) {
        throw response.data.errors[0];
      }

      return response.data.data.createGuiaServico;
    } catch (error) {
      this.openNotification(error.message, 'error');
      throw error;
    } finally {
      this.saving = false;
    }
  }

  @action async findGuiaServicoByIdEntradaProntuario(id) {
    try {
        const response = await Api.post('', {
            query: `
                query {
                    content: findGuiaServicoByIdEntradaProntuario(id: ${id}){
                      beneficiarioCns
                      beneficiarioConvenioNumeroCarteira
                      beneficiarioConvenioValidadeCarteira
                      beneficiarioNome
                      cid10Subcategoria {
                        descricaoAbreviada
                      }
                      solicitanteNome
                      dataHoraLancamento
                      guiaServicoTussViews {
                        quantidadeSolicitada
                        tussView {
                          codigoTermo
                          descricao
                          tabela
                        }
                      }
                    }
                }
            `
        });

        if(response.data.errors) {
            throw response.data.errors[0];
        }

        const { content } = response.data.data;

        return content;

    } catch (error) {
        throw error;
    }
  }
  
  @action reset() {
    this.guiaServico = null;
    this.readOnly = false;
    this.objView = {
      ...defaultObjView
    };
  }
}
