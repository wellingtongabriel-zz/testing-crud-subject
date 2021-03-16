import { observable, action } from "mobx";
import moment from "moment";

import Api from "../../config/api";
import string from "../../utils/string";
import { applyCurrencyMask } from "../../utils/CurrencyMask";
import BaseStore from "../Base.store";
export const TituloTipo = {
  DESPESA: "DESPESA",
  RECEITA: "RECEITA"
};

export const TituloTipoRepeticao = {
  NAO_REPETIR: "NAO_REPETIR",
  PARCELAR: "PARCELAR",
  REPETIR: "REPETIR"
};

export const TituloPeriodicidade = {
  ANUALMENTE: "ANUALMENTE",
  DIARIAMENTE: "DIARIAMENTE",
  MENSALMENTE: "MENSALMENTE",
  QUINZENALMENTE: "QUINZENALMENTE",
  SEMANALMENTE: "SEMANALMENTE"
};

const defaultTitulo = {
  id: null,
  nome: "",
  valor: null,
  dataVencimento: null,
  dataPagamento: null,
  tipo: null
};

const defaultSearchDTO = {
  search: "",
  dataInicial: moment()
    .startOf("month")
    .format("YYYY-MM-DD"),
  dataFinal: moment()
    .endOf("month")
    .format("YYYY-MM-DD"),
  profissionalSaudeId: null
};

const defaultModalState = {
  pago: false,
  tipoRepeticao: TituloTipoRepeticao.PARCELAR,
  valorParcela: null,
  tituloParcelaList: []
};

const defaultTotais = {
  totalReceita: 0,
  totalDespesa: 0,
  total: 0,
  totalReceitaFormatted: "R$ 0,00",
  totalDespesaFormatted: "R$ 0,00",
  totalFormatted: "R$ 0,00"
};

export default class ExtratoStore extends BaseStore {
  usuarioStore = null;
  @observable currentPage = null;
  @observable totalElements = 0;
  @observable numberOfElements = 0;
  @observable editMode = false;
  @observable expanded = true;
  @observable loading = true;
  @observable saving = false;
  @observable opening = false;
  @observable open = false;
  @observable errors = {
    nome: false,
    dataVencimento: false,
    valor: false,
    titulo: false,
  };
  @observable totais = {
    ...defaultTotais
  };
  @observable modalState = {
    ...defaultModalState
  };
  @observable tituloList = [];
  @observable titulo = {
    ...defaultTitulo
  };
  @observable searchDTO = {
    ...defaultSearchDTO
  };

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
            findAllTituloParcela(searchDTO: $searchDTO) {
                id
                tipo
                tipoRepeticao
                numeroParcela
                totalParcelas
                dataVencimento
                nome
                categoriaFinanceira {
                  nome
                }
                valor
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

      this.tituloList = response?.data?.data?.findAllTituloParcela || [];

      let saldo = 0;
      const calculaSaldo = titulo => {
        if (titulo.tipo === TituloTipo.DESPESA) {
          saldo = saldo - titulo.valor;
        }

        if (titulo.tipo === TituloTipo.RECEITA) {
          saldo = saldo + titulo.valor;
        }
        return {
          ...titulo,
          saldo
        };
      };

      if(this.tituloList) {
        this.tituloList = this.tituloList.map(calculaSaldo);
        this.updateTotais(this.tituloList);
      }

    } catch (error) {
      this.totais = {
        ...defaultTotais
      };
      throw error;
    } finally {
      this.loading = false;
    }
  }

  updateTotais(tituloList) {
    let totalReceita = 0;
    let totalDespesa = 0;
    tituloList.forEach(titulo => {
      if (titulo.tipo === TituloTipo.DESPESA) {
        totalDespesa = totalDespesa + titulo.valor;
      }

      if (titulo.tipo === TituloTipo.RECEITA) {
        totalReceita = totalReceita + titulo.valor;
      }
    });

    this.totais.totalDespesa = totalDespesa;
    this.totais.totalReceita = totalReceita;
    this.totais.total = totalReceita - totalDespesa;

    this.totais.totalDespesaFormatted = applyCurrencyMask(this.totais.totalDespesa);
    this.totais.totalReceitaFormatted = applyCurrencyMask(this.totais.totalReceita);
    this.totais.totalFormatted = applyCurrencyMask(this.totais.total);
  }

  @action updateTabelaTituloParcela() {
    this.modalState.tituloParcelaList = [];
    this.modalState.valorParcela = null;

    const {
      valor,
      valorEntrada,
      dataVencimento,
      periodicidade,
      totalParcelas,
      quantidade
    } = this.titulo;
    const { tipoRepeticao } = this.modalState;

    const hasDataVencimento = dataVencimento instanceof moment ? true : false;
    const hasPeriodicidade = periodicidade && periodicidade.id ? true : false;
    const hasValidUpdateRepetir =
      !string.isEmpty(valor) &&
      hasPeriodicidade &&
      parseInt(quantidade) &&
      hasDataVencimento;
    const hasValidUpdateParcelar =
      !string.isEmpty(valor) &&
      !string.isEmpty(totalParcelas) &&
      hasDataVencimento;

    if (
      tipoRepeticao === TituloTipoRepeticao.REPETIR &&
      hasValidUpdateRepetir
    ) {
      const repetirQuantidade = parseInt(quantidade);
      let dataVencimentoAtual = moment(dataVencimento);
      const list = [];

      for (let i = 1; i <= repetirQuantidade; i++) {
        const first = i === 1;
        if (!first && periodicidade.value === TituloPeriodicidade.ANUALMENTE) {
          dataVencimentoAtual = dataVencimentoAtual.add(1, "years");
        }
        if (!first && periodicidade.value === TituloPeriodicidade.DIARIAMENTE) {
          dataVencimentoAtual = dataVencimentoAtual.add(1, "days");
        }
        if (!first && periodicidade.value === TituloPeriodicidade.MENSALMENTE) {
          dataVencimentoAtual = dataVencimentoAtual.add(1, "months");
        }
        if (
          !first &&
          periodicidade.value === TituloPeriodicidade.SEMANALMENTE
        ) {
          dataVencimentoAtual = dataVencimentoAtual.add(1, "weeks");
        }
        if (
          !first &&
          periodicidade.value === TituloPeriodicidade.QUINZENALMENTE
        ) {
          dataVencimentoAtual = dataVencimentoAtual.add(15, "days");
        }

        list.push({
          numeroParcela: i,
          dataVencimento: dataVencimentoAtual.format("YYYY-MM-DD"),
          valor: string.currencyMaskToFloat(valor)
        });
      }

      this.modalState.tituloParcelaList = [...list];
      return;
    }

    if (
      tipoRepeticao === TituloTipoRepeticao.PARCELAR &&
      hasValidUpdateParcelar
    ) {
      const repetir = parseInt(totalParcelas);
      let dataVencimentoAtual = moment(dataVencimento);
      const list = [];

      let parcelaInicial = string.isEmpty(valorEntrada) ? 1 : 0;
      let totalParaParcelar = string.currencyMaskToFloat(valor);

      if (parcelaInicial === 0) {
        totalParaParcelar =
          totalParaParcelar - string.currencyMaskToFloat(valorEntrada);
      }

      const valorParcela = totalParaParcelar / repetir;
      this.modalState.valorParcela = parseFloat(valorParcela)
        .toFixed(2)
        .replace(".", ",");

      for (let i = parcelaInicial; i <= repetir; i++) {
        const first = i === parcelaInicial;
        if (!first) {
          dataVencimentoAtual = dataVencimentoAtual.add(1, "months");
        }

        list.push({
          numeroParcela: i,
          dataVencimento: dataVencimentoAtual.format("YYYY-MM-DD"),
          valor:
            i === 0 ? string.currencyMaskToFloat(valorEntrada) : valorParcela
        });
      }

      this.modalState.tituloParcelaList = [...list];
    }
  }

  @action async create(titulo) {
    try {
      if (this.saving) {
        return;
      }

      if (this.contemErros(titulo)) {
        return;
      }
      
      const tituloDados = {
          nome: titulo.nome,
          valor: string.currencyMaskToFloat(titulo.valor),
          dataVencimento: titulo.dataVencimento.format("YYYY-MM-DD"),
          dataPagamento: titulo.dataPagamento ? titulo.dataPagamento.format("YYYY-MM-DD") : undefined,
          tipo: titulo.tipo,
        };

      if (titulo.sujeitoAtencao && titulo.sujeitoAtencao.id) {
        tituloDados.sujeitoAtencao = {
          id: titulo.sujeitoAtencao.id
        };
      }

      if (titulo.convenio && titulo.convenio.id) {
        tituloDados.convenio = {
          id: titulo.convenio.id
        };
      }

      if (titulo.profissionalSaude && titulo.profissionalSaude.id) {
        tituloDados.profissionalSaude = {
          id: titulo.profissionalSaude.id
        };
      }

      if (titulo.formaPagamento && titulo.formaPagamento.id) {
        tituloDados.formaPagamento = {
          id: titulo.formaPagamento.id
        };
      }

      if (titulo.centroCusto && titulo.centroCusto.id) {
        tituloDados.centroCusto = {
          id: titulo.centroCusto.id
        };
      }

      if (titulo.categoriaFinanceira && titulo.categoriaFinanceira.id) {
        tituloDados.categoriaFinanceira = {
          id: titulo.categoriaFinanceira.id
        };
      }

      if (titulo.contaBancaria && titulo.contaBancaria.id) {
        tituloDados.contaBancaria = {
          id: titulo.contaBancaria.id
        };
      }

      if (!string.isEmpty(titulo.valorEntrada)) {
        tituloDados.valorEntrada = string.currencyMaskToFloat(
          titulo.valorEntrada
        );
      }

      if (!string.isEmpty(titulo.totalParcelas)) {
        tituloDados.totalParcelas = parseInt(titulo.totalParcelas, 10);
        tituloDados.tipoRepeticao = this.modalState.tipoRepeticao;
      }

      if (TituloTipoRepeticao.REPETIR === this.modalState.tipoRepeticao) {
        tituloDados.totalParcelas = parseInt(titulo.quantidade, 10);
        tituloDados.periodicidade =
          titulo.periodicidade && titulo.periodicidade.value
            ? titulo.periodicidade.value
            : null;
        tituloDados.tipoRepeticao = this.modalState.tipoRepeticao;
      }

      if (
        TituloTipoRepeticao.PARCELAR === tituloDados.tipoRepeticao &&
        !tituloDados.totalParcelas
      ) {
        throw new Error("Preencha o número de parcelas");
      }

      if (
        TituloTipoRepeticao.REPETIR === tituloDados.tipoRepeticao &&
        !tituloDados.totalParcelas
      ) {
        throw new Error("Preencha a quantidade");
      }

      if (
        TituloTipoRepeticao.REPETIR === tituloDados.tipoRepeticao &&
        string.isEmpty(tituloDados.periodicidade)
      ) {
        throw new Error("Selecione a periodicidade");
      }
      
      const usuarioLogado = await this.usuarioStore.getUsuarioLogado();

      const unidadeId = usuarioLogado.unidadeAtual.id;

      const query = `
        mutation ($titulo: TituloInput) {
            createTitulo(titulo: $titulo) {
                id
            }
        }
      `;
      const variables = {
        titulo: {
          ...tituloDados,
          unidade: {
            id: unidadeId
          }
        }
      };
      
      this.saving = true;
      await Api.post("", {
        query,
        variables
      });
    } catch (error) {
      throw error;
    } finally {
      this.saving = false;
    }
  }
  
  @action async update(titulo) {
    try {
      if (this.saving) {
        return;
      }

      if (this.contemErros(titulo)) {
        throw Error('Preencha os dados');
      }

      const tituloDados = {
        id: titulo.id,
        nome: titulo.nome,
        valor: string.currencyMaskToFloat(titulo.valor),
        dataVencimento: titulo.dataVencimento.format("YYYY-MM-DD"),
        dataPagamento: titulo.dataPagamento ? titulo.dataPagamento.format("YYYY-MM-DD") : undefined,
        tipo: titulo.tipo,
      };

      const hasFormaPagamento =
        titulo.formaPagamento && titulo.formaPagamento.id ? true : false;
      
      if (hasFormaPagamento) {
        tituloDados.formaPagamento = {
          id: titulo.formaPagamento.id
        };
      }

      const usuarioLogado = await this.usuarioStore.getUsuarioLogado();

      const unidadeId = usuarioLogado.unidadeAtual.id;

      const query = `
        mutation ($tituloParcela: TituloParcelaInput) {
            updateTituloParcela(tituloParcela: $tituloParcela) {
                id
            }
        }
      `;
      const variables = {
        tituloParcela: {
          ...tituloDados,
          unidade: {
            id: unidadeId
          }
        }
      };

      
      this.saving = true;
      await Api.post("", {
        query,
        variables
      });
    } catch (error) {
      throw error;
    } finally {
      this.saving = false;
    }
  }

  contemErros(titulo) {
    if (!titulo) {
      this.openNotification('Por favor, envie os dados do título.', 'error');
      return true;
    }

    this.errors = {
      nome: false,
      dataVencimento: false,
      valor: false,
      titulo: false,
    };

    let error = false;

    const hasDataVencimento =
      titulo.dataVencimento instanceof moment ? true : false;

    if (string.isEmpty(titulo.nome)) {
      error = true;
      this.errors.nome = true;
    }
    if (string.isEmpty(titulo.valor)) {
      error = true;
      this.errors.valor = true;
    }
    if (string.isEmpty(titulo.tipo)) {
      error = true;
      this.errors.tipo = true;
    }
    if (!hasDataVencimento) {
      error = true;
      this.errors.dataVencimento = true;
    }

    if (error) {
      this.openNotification(`Por favor, corrija os campos abaixo:`, 'error');
      return true;
    }

    return false;
  }

  @action edit(id) {
    this.open = true;
    this.editMode = true;
    this.expanded = false;
    this.loadById(id);
  }

  @action openNew(tipo) {
    this.open = true;
    this.expanded = true;
    this.titulo = {
      ...defaultTitulo,
      tipo
    };
  }

  @action async loadById(id) {
    try {
      this.opening = true;
      const response = await Api.post("", {
        query: `
            query ($id: Long) {
              findByIdTituloParcela(id: $id) {
                id
                categoriaFinanceira {
                  id
                  nome
                }
                centroCusto {
                  id
                  nome
                }
                contaBancaria {
                  id
                  nome
                }
                formaPagamento {
                  id
                  nome
                }
                convenio {
                  id
                  descricao
                  valorConsulta
                }
                profissionalSaude {
                  id
                  nome
                }
                sujeitoAtencao {
                  id
                  nome
                }
                dataPagamento
                dataVencimento
                nome
                numeroParcela
                periodicidade
                tipo
                tipoRepeticao
                totalParcelas
                valor
              }
            }
        `,
        variables: {
          id
        }
      });

      const data = response.data.data.findByIdTituloParcela;

      this.titulo = {
        ...data,
        valor: parseFloat(data.valor)
          .toFixed(2)
          .replace(".", ","),
        dataPagamento: moment(data.dataPagamento),
        dataVencimento: moment(data.dataVencimento),
        categoriaFinanceira:
          data.categoriaFinanceira && data.categoriaFinanceira.id
            ? {
                ...data.categoriaFinanceira,
                value: data.categoriaFinanceira.id,
                label: data.categoriaFinanceira.nome
              }
            : null,
        sujeitoAtencao:
          data.sujeitoAtencao && data.sujeitoAtencao.id
            ? {
                ...data.sujeitoAtencao,
                value: data.sujeitoAtencao.id,
                label: data.sujeitoAtencao.nome
              }
            : null,
        profissionalSaude:
          data.profissionalSaude && data.profissionalSaude.id
            ? {
                ...data.profissionalSaude,
                value: data.profissionalSaude.id,
                label: data.profissionalSaude.nome
              }
            : null,
        centroCusto:
          data.centroCusto && data.centroCusto.id
            ? {
                ...data.centroCusto,
                value: data.centroCusto.id,
                label: data.centroCusto.nome
              }
            : null,
        contaBancaria:
          data.contaBancaria && data.contaBancaria.id
            ? {
                ...data.contaBancaria,
                value: data.contaBancaria.id,
                label: data.contaBancaria.nome
              }
            : null,
        formaPagamento:
          data.formaPagamento && data.formaPagamento.id
            ? {
                ...data.formaPagamento,
                value: data.formaPagamento.id,
                label: data.formaPagamento.nome
              }
            : null,
        convenio:
          data.convenio && data.convenio.id
            ? {
                ...data.convenio,
                value: data.convenio.id,
                label: data.convenio.descricao
              }
            : null
      };
    } catch (error) {
      throw error;
    } finally {
      this.opening = false;
    }
  }

  @action closeModal() {
    this.open = false;
    this.editMode = false;
    this.titulo = {
      ...defaultTitulo
    };
    this.modalState = {
      ...defaultModalState
    };
  }

  @action async findAllSujeitoAtencao(searchDTO = {}) {
    try {
      const defaultSearchDTO = {
        pageSize: 30,
        pageNumber: 0,
        sortDir: "ASC",
        sortField: "nome"
      };

      const response = await Api.post("", {
        query: `
          query ($searchDTO: SearchDTOInput) {
            findAllSujeitoAtencao(searchDTO: $searchDTO) {
              last
              totalElements
              numberOfElements
              content {
                id
                nome
                profissionalSaude {
                  id
                  nome
                }
                dadosConvenio {
                  convenio {
                    id
                    descricao
                    valorConsulta
                  }
                }
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

      const { last, content } = response.data.data.findAllSujeitoAtencao;

      const customContent = content.map(c => {
          const profissionalSaude = c.profissionalSaude && {
            ...c.profissionalSaude,
            value: c.profissionalSaude.id,
            label: c.profissionalSaude.nome,
          };
          const convenio = c.dadosConvenio && c.dadosConvenio.convenio && {
            ...c.dadosConvenio.convenio,
            value: c.dadosConvenio.convenio.id,
            label: c.dadosConvenio.convenio.descricao
          };

          return ({
          ...c,
          value: c.id,
          label: c.nome,
          profissionalSaude,
          convenio
        })
      });

      return {
        last,
        content: customContent
      };
    } catch (error) {
      throw error;
    }
  }

  @action async findAllFormaPagamento(searchDTO = {}) {
    try {
      const defaultSearchDTO = {
        pageSize: 30,
        pageNumber: 0,
        sortDir: "ASC",
        sortField: "nome"
      };

      const response = await Api.post("", {
        query: `
          query ($searchDTO: SearchDTOInput) {
            findAllFormaPagamento(searchDTO: $searchDTO) {
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
            ...searchDTO
          }
        }
      });

      const { last, content } = response.data.data.findAllFormaPagamento;

      const customContent = content.map(c => ({
        ...c,
        value: c.id,
        label: c.nome
      }));

      return {
        last,
        content: customContent
      };
    } catch (error) {
      throw error;
    }
  }

  @action async findAllProfissionalSaude(searchDTO = {}) {
    try {
      const usuarioLogado = await this.usuarioStore.getUsuarioLogado();

      const unidadeId = usuarioLogado.unidadeAtual.id;

      const defaultSearchDTO = {
        pageSize: 30,
        pageNumber: 0,
        sortDir: "ASC",
        sortField: "nome",
        unidadeId
      };

      const response = await Api.post("", {
        query: `
          query ($searchDTO: SearchDTOInput) {
            findAllProfissionalSaude(searchDTO: $searchDTO) {
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
            ...searchDTO
          }
        }
      });

      const { last, content } = response.data.data.findAllProfissionalSaude;

      const customContent = content.map(c => ({
        ...c,
        value: c.id,
        label: c.nome
      }));

      return {
        last,
        content: customContent
      };
    } catch (error) {
      throw error;
    }
  }

  @action async findAllCentroCusto(searchDTO = {}) {
    try {
      const usuarioLogado = await this.usuarioStore.getUsuarioLogado();

      const unidadeId = usuarioLogado.unidadeAtual.id;

      const defaultSearchDTO = {
        pageSize: 30,
        pageNumber: 0,
        sortDir: "ASC",
        sortField: "nome",
        unidadeId
      };

      const response = await Api.post("", {
        query: `
          query ($searchDTO: SearchDTOInput) {
            findAllCentroCusto(searchDTO: $searchDTO) {
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
            ...searchDTO
          }
        }
      });

      const { last, content } = response.data.data.findAllCentroCusto;

      const customContent = content.map(c => ({
        ...c,
        value: c.id,
        label: c.nome
      }));

      return {
        last,
        content: customContent
      };
    } catch (error) {
      throw error;
    }
  }

  @action async findAllConvenio(searchDTO = {}) {
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
            findAllConvenio(searchDTO: $searchDTO) {
              last
              totalElements
              numberOfElements
              content {
                id
                descricao
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

      const { last, content } = response.data.data.findAllConvenio;

      const customContent = content.map(c => ({
        ...c,
        value: c.id,
        label: c.descricao
      }));

      return {
        last,
        content: customContent
      };
    } catch (error) {
      throw error;
    }
  }

  @action async findAllContaBancaria(searchDTO = {}) {
    try {
      const defaultSearchDTO = {
        pageSize: 30,
        pageNumber: 0,
        sortDir: "ASC",
        sortField: "nome"
      };

      const response = await Api.post("", {
        query: `
          query ($searchDTO: SearchDTOInput) {
            findAllContaBancaria(searchDTO: $searchDTO) {
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
            ...searchDTO
          }
        }
      });

      const { last, content } = response.data.data.findAllContaBancaria;

      const customContent = content.map(c => ({
        ...c,
        value: c.id,
        label: c.nome
      }));

      return {
        last,
        content: customContent
      };
    } catch (error) {
      throw error;
    }
  }

  @action async findAllCategoriaFinanceira(searchDTO = {}) {
    try {
      const defaultSearchDTO = {
        pageSize: 30,
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
            ...defaultSearchDTO,
            ...searchDTO
          }
        }
      });

      const { last, content } = response.data.data.findAllCategoriaFinanceira;

      const list = [];
      content.forEach(c => {
        list.push({
          ...c,
          value: c.id,
          label: c.nome
        });

        if (c.categoriasFinanceiras instanceof Array) {
          c.categoriasFinanceiras.forEach(i => {
            list.push({
              ...i,
              value: i.id,
              label: `- ${i.nome}`
            });
          });
        }
      });

      return {
        last,
        content: list
      };
    } catch (error) {
      throw error;
    }
  }

  @action findAllPeriodicidades() {
    return Object.values(TituloPeriodicidade).map(p => ({
      id: p,
      label: string.capitalize(p),
      value: p
    }));
  }
}
