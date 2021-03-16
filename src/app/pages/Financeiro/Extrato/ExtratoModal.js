import React from "react";
import moment from "moment";
import debounce from "lodash.debounce";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles/index";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";

import Table from "../../../components/Table/Table";
import Scroll from "../../../components/InfiniteScroll/Scroll";
import arrowLeft from "../../../assets/img/svg/left-arrow.svg";
import arrowRight from "../../../assets/img/svg/right-arrow.svg";
import Dialog from "../../../components/Dialog/Dialog";
import DialogHeader from "../../../components/Dialog/DialogHeader";
import { TextField, TextFieldSearch } from "../../../components/TextField";
import {
  Typography,
  CircularProgress,
  FormControlLabel,
  Checkbox
} from "@material-ui/core";
import ButtonClearPrimary from "../../../components/Button/ButtonClearPrimary";
import ButtonGray from "../../../components/Button/ButtonGray";
import ButtonPrimary from "../../../components/Button/ButtonPrimary";
import Colors from "../../../template/Colors";
import InputDateForm from "../../../components/Input/InputDateForm";
import { TituloTipoRepeticao } from "../../../stores/Financeiro/Extrato.store";
import classnames from "classnames";
import string from "../../../utils/string";
import { applyCurrencyMask } from "../../../utils/CurrencyMask";
import { findConveniosByAtivo } from "./../../../services/ConvenioService";
import Notification from "../../../components/Notification";
import { db } from "../../../config/config";

const styles = () => ({
  root: {
    display: "grid",
    gridTemplateRows: "auto 1fr",
    minWidth: 600,
    minHeight: 550
  },
  formGroup: {
    marginTop: 15
  },
  formGroupPago: {
    display: "flex",
    paddingBottom: 5,
    visibility: "hidden"
  },
  input: {
    marginRight: 5,
    marginLeft: 5
  },
  formActions: {
    marginTop: 20
  },
  inlineButtons: {
    paddingLeft: "15px",
    display: "inline-flex",
    width: "100%"
  },
  gridDivider: {
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
    height: "100%",

    "&>div": {
      borderLeft: "1px solid " + Colors.commons.gray3,
      height: "300px"
    }
  },
  gridArrow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer"
  },
  scrollContainer: {
    marginTop: 10,
    height: "30vh",

    "& thead": {
      display: "none"
    },

    "& tbody td": {
      textAlign: "center",

      "&:last-child": {
        textAlign: "right"
      }
    }
  }
});

const columnsTituloParcela = [
  {
    Header: "",
    getValue: row => {
      return row.numeroParcela === 0 ? "E" : row.numeroParcela;
    }
  },
  {
    Header: "",
    getValue: row => {
      if (string.isEmpty(row.dataVencimento)) {
        return "-";
      }
      return moment(row.dataVencimento).format("DD/MM/YYYY");
    }
  },
  {
    Header: "",
    getValue: row => {
      if (typeof row.valor !== "number") {
        return "-";
      }
      return applyCurrencyMask(row.valor);
    }
  }
];

@inject("extratoStore")
@observer
class ExtratoModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      periodicidades: [],
      isPago: false
    };

    this.debounceUpdateTabelaTituloParcela = debounce(
      this.debounceUpdateTabelaTituloParcela,
      500
    );
  }

  componentDidMount() {
    const { extratoStore } = this.props;

    const periodicidades = extratoStore.findAllPeriodicidades();

    extratoStore.resetNotification();
    extratoStore.errors = {
      nome: false,
      dataVencimento: false,
      valor: false,
      titulo: false,
    };

    this.setState({ periodicidades });
  }

  debounceUpdateTabelaTituloParcela() {
    this.props.extratoStore.updateTabelaTituloParcela();
  }

  handleChange = (field, event) => {
    const { extratoStore } = this.props;

    if (field === "convenio" ||
      field === "sujeitoAtencao" ||
      field === "profissionalSaude" ||
      field === "formaPagamento" ||
      field === "centroCusto" ||
      field === "periodicidade" ||
      field === "contaBancaria" ||
      field === "categoriaFinanceira" ||
      field === "dataPagamento" ||
      field === "dataVencimento"
    ) {

        extratoStore.titulo[field] = event;

    } else {
      extratoStore.titulo[field] = event.target.value;
    }

    if (field === 'sujeitoAtencao' && !!event) {
      if (event.profissionalSaude) {
        extratoStore.titulo['profissionalSaude'] = event.profissionalSaude;
      }
      if (event.convenio) {
        extratoStore.titulo['convenio'] = event.convenio;

        if(event.convenio.valorConsulta) {
          extratoStore.titulo['valor'] = parseFloat(event.convenio.valorConsulta)
              .toFixed(2)
              .replace(".", ",");
        }
      }

    }

    if(field === "convenio"){
        if(event.valorConsulta) {
          extratoStore.titulo['valor'] = parseFloat(event.valorConsulta)
              .toFixed(2)
              .replace(".", ",");
        }
    }

    if (
      field === "valor" ||
      field === "dataVencimento" ||
      field === "periodicidade" ||
      field === "valorEntrada" ||
      field === "quantidade" ||
      field === "totalParcelas"
    ) {
      this.debounceUpdateTabelaTituloParcela();
    }
  };

  handleClose = () => {
    const { onClose, extratoStore } = this.props;

    extratoStore.closeModal();

    if (typeof onClose === "function") {
      onClose();
    }
  };

  handleConfirmar = async e => {
    try {
      e.preventDefault();

      const { extratoStore } = this.props;

      const titulo = {
        ...extratoStore.titulo
      };

      if (titulo.id) {
        await extratoStore.update(titulo);
      } else {

        await extratoStore.create(titulo);
      }

      extratoStore.closeModal();
      extratoStore.tituloList = [];
      extratoStore.currentPage = null;
      extratoStore.searchDTO.pageNumber = 0;
      extratoStore.findAll();
    } catch (error) {
      console.warn(error && error.message);
    }
  };

  expandir = () => {
    this.props.extratoStore.expanded = !this.props.extratoStore.expanded;
  };

  handleLoadMoreOptions = async ({ search, data, method }) => {
    const { extratoStore } = this.props;
    let searchDTO = {};

    if (data.searchDTO) {
      searchDTO = {
        ...data.searchDTO
      };
    }

    const response = await extratoStore[method]({
      pageNumber: data.page,
      search,
      ...searchDTO
    });

    return {
      options: response.content,
      hasMore: !response.last,
      additional: {
        page: data.page + 1
      }
    };
  };

  handleSujeitoAtencaoLoadOptions = async (search, loadedOptions, { page }) => {
    return this.handleLoadMoreOptions({
      search,
      loadedOptions,
      data: { page },
      method: "findAllSujeitoAtencao"
    });
  };

  handleFormaPagamentoLoadOptions = async (search, loadedOptions, { page }) => {
    return this.handleLoadMoreOptions({
      search,
      loadedOptions,
      data: { page },
      method: "findAllFormaPagamento"
    });
  };

  handleCentroCustoLoadOptions = async (search, loadedOptions, { page }) => {
    return this.handleLoadMoreOptions({
      search,
      loadedOptions,
      data: { page },
      method: "findAllCentroCusto"
    });
  };

  handleConvenioLoadOptions = (search, loadedOptions, { page }) => {
    return db.get("usuarioLogado", "{}")
        .then(usuarioLogadoString => {
            const usuarioLogado = JSON.parse(usuarioLogadoString);

            return findConveniosByAtivo(usuarioLogado.unidadeAtual.id)
              .then(({ data: response }) => {
                const options = response.data.convenios.map(convenio => ({
                  ...convenio,
                  label: convenio.descricao,
                  value: convenio.id
                }));
                
                return ({ options });
              });
        });
  };

  handleProfissionalSaudeLoadOptions = async (
    search,
    loadedOptions,
    { page }
  ) => {
    return this.handleLoadMoreOptions({
      search,
      loadedOptions,
      data: { page },
      method: "findAllProfissionalSaude"
    });
  };

  handleContaBancariaLoadOptions = async (search, loadedOptions, { page }) => {
    return this.handleLoadMoreOptions({
      search,
      loadedOptions,
      data: { page },
      method: "findAllContaBancaria"
    });
  };

  handleCategoriaLoadOptions = async (search, loadedOptions, { page }) => {
    return this.handleLoadMoreOptions({
      search,
      loadedOptions,
      data: {
        page,
        searchDTO: {
          categoriaFinanceiraTipo: this.props.extratoStore.titulo.tipo
        }
      },
      method: "findAllCategoriaFinanceira"
    });
  };

  handleChangeTipoRepeticaoButton = tipo => {
    const { extratoStore } = this.props;
    extratoStore.modalState.tipoRepeticao = tipo;
    extratoStore.updateTabelaTituloParcela();
  };

  loadMoreTituloParcela = () => {};

  renderTipoRepeticaoButtons = () => {
    const { classes, extratoStore } = this.props;
    const { tipoRepeticao } = extratoStore.modalState;
    const ParcelarButton =
      tipoRepeticao === TituloTipoRepeticao.PARCELAR
        ? ButtonPrimary
        : ButtonGray;
    const RepetirButton =
      tipoRepeticao === TituloTipoRepeticao.REPETIR
        ? ButtonPrimary
        : ButtonGray;

    return (
      <React.Fragment>
        <Grid item xs={6} className={classes.formGroup}>
          <ParcelarButton
            noBorderRight
            onClick={() =>
              this.handleChangeTipoRepeticaoButton(TituloTipoRepeticao.PARCELAR)
            }
          >
            Parcelar
          </ParcelarButton>
        </Grid>
        <Grid
          item
          xs={6}
          className={classes.formGroup}
          onClick={() =>
            this.handleChangeTipoRepeticaoButton(TituloTipoRepeticao.REPETIR)
          }
        >
          <RepetirButton noBorderLeft>Repetir</RepetirButton>
        </Grid>
      </React.Fragment>
    );
  };

  renderTabelaTituloParcela = () => {
    const { classes, extratoStore } = this.props;
    const { tituloParcelaList } = extratoStore.modalState;

    const hasMore = false;

    return (
      <Grid item xs={12}>
        {tituloParcelaList.length > 0 && (
          <Scroll
            loadMore={this.loadMoreTituloParcela}
            hasMore={hasMore}
            pageStart={0}
            className={classes.scrollContainer}
          >
            <Table dados={tituloParcelaList} columns={columnsTituloParcela} />
          </Scroll>
        )}
      </Grid>
    );
  };



  render() {
    const { periodicidades } = this.state;
    const { classes, open, extratoStore } = this.props;
    const { titulo, saving, opening, modalState, editMode, errors } = extratoStore;
    const { tipoRepeticao, pago, valorParcela } = modalState;

    return (
      <Dialog
        open={open}
        maxWidth={extratoStore.expanded ? "lg" : "sm"}
        fullWidth={extratoStore.expanded}
      >
        <div className={classes.root}>
          <DialogHeader
            title={string.capitalize(titulo.tipo || "")}
            closeButton={true}
            actionClose={this.handleClose}
          />

          <DialogContent>
            {opening === true && (
              <Grid
                container
                justify="center"
                alignItems="center"
                style={{ height: "100%" }}
              >
                <CircularProgress size={30} />
              </Grid>
            )}
            {opening === false && (
              <form onSubmit={this.handleConfirmar}>
                <Grid container>
                  <Grid item xs={extratoStore.expanded ? 6 : 11}>
                    <Grid container>
                      <Grid item xs={8} className={classes.formGroup}>
                        <div className={classes.input}>
                          <Typography color="primary" component="label">
                            Sujeito de Atenção
                          </Typography>
                          <TextFieldSearch
                            placeholder=""
                            loadOptions={this.handleSujeitoAtencaoLoadOptions}
                            withPaginate
                            value={titulo.sujeitoAtencao}
                            onChange={e =>
                              this.handleChange("sujeitoAtencao", e)
                            }
                            debounceTimeout={300}
                            additional={{
                              page: 0
                            }}
                            isDisabled={editMode}
                          />
                        </div>
                      </Grid>
                      <Grid item xs={4} className={classes.formGroup}>
                        <div className={classes.input}>
                          <Typography color="primary" component="label">
                            Convênio
                          </Typography>
                          <TextFieldSearch
                            placeholder=""
                            loadOptions={this.handleConvenioLoadOptions}
                            withPaginate
                            value={titulo.convenio}
                            onChange={e => this.handleChange("convenio", e)}
                            debounceTimeout={300}
                            additional={{
                              page: 0
                            }}
                            isDisabled={editMode}
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} className={classes.formGroup}>
                        <div className={classes.input}>
                          <Typography color="primary" component="label">
                            Profissional de Saúde
                          </Typography>
                          <TextFieldSearch
                            placeholder=""
                            loadOptions={
                              this.handleProfissionalSaudeLoadOptions
                            }
                            withPaginate
                            value={titulo.profissionalSaude}
                            onChange={e =>
                              this.handleChange("profissionalSaude", e)
                            }
                            debounceTimeout={300}
                            additional={{
                              page: 0
                            }}
                            isDisabled={editMode}
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} className={classes.formGroup}>
                        <div className={classes.input}>
                          <Typography color="primary" component="label">
                            Descrição *
                          </Typography>
                          <TextField
                            error={errors.nome}
                            value={titulo.nome || ""}
                            onChange={e => this.handleChange("nome", e)}
                          />
                        </div>
                      </Grid>
                      <Grid item xs={4} className={classes.formGroup}>
                        <div className={classes.input}>
                          <Typography color="primary" component="label">
                            Valor *
                          </Typography>
                          <TextField
                            error={errors.valor}
                            value={titulo.valor || ""}
                            onChange={e => this.handleChange("valor", e)}
                            withCurrencyMask
                          />
                        </div>
                      </Grid>
                      <Grid item xs={4} className={classes.formGroup}>
                        <div className={classes.input}>
                          <Typography color="primary" component="label">
                            Categoria
                          </Typography>
                          <TextFieldSearch
                            placeholder=""
                            loadOptions={this.handleCategoriaLoadOptions}
                            withPaginate
                            value={titulo.categoriaFinanceira}
                            onChange={e =>
                              this.handleChange("categoriaFinanceira", e)
                            }
                            debounceTimeout={300}
                            additional={{
                              page: 0
                            }}
                            isDisabled={editMode}
                          />
                        </div>
                      </Grid>
                      <Grid item xs={4} className={classes.formGroup}>
                        <div className={classes.input}>
                          <Typography color="primary" component="label">
                            Conta
                          </Typography>
                          <TextFieldSearch
                            placeholder=""
                            loadOptions={this.handleContaBancariaLoadOptions}
                            withPaginate
                            value={titulo.contaBancaria}
                            onChange={e =>
                              this.handleChange("contaBancaria", e)
                            }
                            debounceTimeout={300}
                            additional={{
                              page: 0
                            }}
                            isDisabled={editMode}
                          />
                        </div>
                      </Grid>
                      <Grid item xs={8} className={classes.formGroup}>
                        <div className={classes.input}>
                          <Typography color="primary" component="label">
                            Forma de Pagamento
                          </Typography>
                          <TextFieldSearch
                            placeholder=""
                            loadOptions={this.handleFormaPagamentoLoadOptions}
                            withPaginate
                            value={titulo.formaPagamento}
                            onChange={e =>
                              this.handleChange("formaPagamento", e)
                            }
                            debounceTimeout={300}
                            additional={{
                              page: 0
                            }}
                          />
                        </div>
                      </Grid>
                      <Grid item xs={4} className={classes.formGroup}>
                        <div className={classes.input}>
                          <Typography color="primary" component="label">
                            Centro de Custo
                          </Typography>
                          <TextFieldSearch
                            placeholder=""
                            loadOptions={this.handleCentroCustoLoadOptions}
                            withPaginate
                            value={titulo.centroCusto}
                            onChange={e => this.handleChange("centroCusto", e)}
                            debounceTimeout={300}
                            additional={{
                              page: 0
                            }}
                            isDisabled={editMode}
                          />
                        </div>
                      </Grid>
                      <Grid item xs={5} className={classes.formGroup}>
                        <div className={classes.input}>
                          <Typography color="primary" component="label">
                            Vencimento *
                          </Typography>
                          <InputDateForm
                            error={errors.dataVencimento}
                            variant="outlined"
                            fullWidth
                            value={titulo.dataVencimento}
                            onChange={e =>
                              this.handleChange("dataVencimento", e)
                            }
                          />
                        </div>
                      </Grid>

                      <Grid
                        item
                        xs={2}
                        className={classnames(
                          classes.formGroup,
                          classes.formGroupPago
                        )}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={pago}
                              color="primary"
                              onChange={() => {
                                  this.setState({isPago: !this.state.isPago}, () => {
                                    if(!this.state.isPago){
                                      extratoStore.titulo["dataPagamento"] = ''
                                    }
                                  });
                                  return (extratoStore.modalState.pago = !extratoStore.modalState.pago)
                              }}
                            />
                          }
                          label={
                            <Typography color="primary" component="label">
                              Pago?
                            </Typography>
                          }
                          labelPlacement="start"
                        />
                      </Grid>

                      <Grid item xs={5} className={classes.formGroup}>
                        <div className={classes.input}>
                          <Typography color="primary" component="label">
                            Data de pag.
                          </Typography>
                          <InputDateForm
                            variant="outlined"
                            fullWidth
                            value={titulo.dataPagamento}
                            onChange={e =>
                              this.handleChange("dataPagamento", e)
                            }
                          />
                        </div>
                      </Grid>

                    </Grid>
                  </Grid>
                  {!editMode && (
                    <Grid item xs={1} className={classes.gridArrow}>
                      <img
                        alt=""
                        src={extratoStore.expanded ? arrowLeft : arrowRight}
                        width={25}
                        onClick={() => this.expandir()}
                      />
                    </Grid>
                  )}
                  {extratoStore.expanded && (
                    <React.Fragment>
                      <Grid item xs={1}>
                        <div className={classes.gridDivider}>
                          <div />
                        </div>
                      </Grid>
                      <Grid item xs={4}>
                        <Grid container>
                          {this.renderTipoRepeticaoButtons()}
                          {tipoRepeticao === TituloTipoRepeticao.PARCELAR && (
                            <React.Fragment>
                              <Grid item xs={6} className={classes.formGroup}>
                                <div className={classes.input}>
                                  <Typography color="primary" component="label">
                                    Entrada
                                  </Typography>
                                  <TextField
                                    value={titulo.valorEntrada || ""}
                                    onChange={e =>
                                      this.handleChange("valorEntrada", e)
                                    }
                                    withCurrencyMask
                                  />
                                </div>
                              </Grid>
                              <Grid item xs={6} className={classes.formGroup}>
                                <Typography
                                  color="primary"
                                  component="label"
                                  style={{ marginLeft: 5 }}
                                >
                                  Parcelas
                                </Typography>
                                <Grid container>
                                  <Grid item xs={4}>
                                    <div className={classes.input}>
                                      <TextField
                                        value={titulo.totalParcelas || ""}
                                        onChange={e =>
                                          this.handleChange("totalParcelas", e)
                                        }
                                      />
                                    </div>
                                  </Grid>
                                  <Grid item xs={8}>
                                    <div className={classes.input}>
                                      <TextField
                                        value={valorParcela || ""}
                                        withCurrencyMask
                                        disabled
                                      />
                                    </div>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </React.Fragment>
                          )}
                          {tipoRepeticao === TituloTipoRepeticao.REPETIR && (
                            <React.Fragment>
                              <Grid item xs={8} className={classes.formGroup}>
                                <div className={classes.input}>
                                  <Typography color="primary" component="label">
                                    Periodicidade
                                  </Typography>
                                  <TextFieldSearch
                                    placeholder=""
                                    options={periodicidades}
                                    onChange={e =>
                                      this.handleChange("periodicidade", e)
                                    }
                                  />
                                </div>
                              </Grid>
                              <Grid item xs={4} className={classes.formGroup}>
                                <Typography
                                  color="primary"
                                  component="label"
                                  style={{ marginLeft: 5 }}
                                >
                                  Quantidade
                                </Typography>
                                <Grid container>
                                  <Grid item xs={12}>
                                    <div className={classes.input}>
                                      <TextField
                                        value={titulo.quantidade || ""}
                                        onChange={e =>
                                          this.handleChange("quantidade", e)
                                        }
                                      />
                                    </div>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </React.Fragment>
                          )}
                          {this.renderTabelaTituloParcela()}
                        </Grid>
                      </Grid>
                    </React.Fragment>
                  )}
                  {extratoStore.expanded && <Grid item xs={7} />}
                  <Grid
                    item
                    xs={extratoStore.expanded ? 5 : 11}
                    className={classes.formActions}
                  >
                    <Grid container>
                      <Grid item xs={6} />
                      <Grid
                        item
                        xs={3}
                        className={classes.inlineButtons}
                      >
                        <ButtonClearPrimary onClick={this.handleClose}>
                          Cancelar
                        </ButtonClearPrimary>
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        className={classes.inlineButtons}
                      >
                        <ButtonPrimary
                          type="submit"
                          onClick={this.handleConfirmar}
                        >
                          Confirmar
                          {saving === true && (
                            <CircularProgress
                              color="inherit"
                              size={14}
                              style={{ marginLeft: 10 }}
                            />
                          )}
                        </ButtonPrimary>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            )}
          </DialogContent>
          <Notification
            close={(event, reason) => extratoStore.closeNotification(event, reason)}
            reset={() => extratoStore.resetNotification()}
            isOpen={extratoStore.notification.isOpen}
            variant={extratoStore.notification.variant}
            message={extratoStore.notification.message}
          />
        </div>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ExtratoModal);
