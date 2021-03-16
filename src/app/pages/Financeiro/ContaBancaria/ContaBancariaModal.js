import React from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles/index";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";

import Dialog from "../../../components/Dialog/Dialog";
import DialogHeader from "../../../components/Dialog/DialogHeader";
import { TextField, TextFieldSearch } from "../../../components/TextField";
import { Typography, CircularProgress } from "@material-ui/core";
import ButtonClearPrimary from "../../../components/Button/ButtonClearPrimary";
import ButtonPrimary from "../../../components/Button/ButtonPrimary";

const styles = () => ({
  root: {
    display: "grid",
    gridTemplateRows: "auto 1fr"
  },
  formGroup: {
    marginTop: 15
  },
  formActions: {
    marginTop: 20
  },
  inlineButtons: {
    paddingLeft: "15px",
    display: "inline-flex",
    width: "100%"
  }
});

@inject("contaBancariaStore")
@observer
class ContaBancariaModal extends React.Component {

  handleChange = (field, event) => {
    const { contaBancariaStore } = this.props;

    if (field === "banco") {
      contaBancariaStore.objView[field] = event;
      return;
    }

    contaBancariaStore.objView[field] = event.target.value;
  };

  handleClose = () => {
    const { onClose, contaBancariaStore } = this.props;
    this.props.disableSaldoInicial(true)
    contaBancariaStore.closeModal();

    if (typeof onClose === "function") {
      onClose();
    }
  };

  

  handleConfirmar = async e => {
    try {
      e.preventDefault();

      const { contaBancariaStore } = this.props;

      const contaBancaria = {
        ...contaBancariaStore.objView
      };

      await contaBancariaStore.save(contaBancaria);
      contaBancariaStore.closeModal();
      contaBancariaStore.contaBancariaList = [];
      contaBancariaStore.currentPage = null;
      contaBancariaStore.searchDTO.pageNumber = 0;
      contaBancariaStore.findAll();
    } catch (error) {
      console.warn(error && error.message);
    }
  };

  handleBancoLoadOptions = async (search, loadedOptions, { page }) => {
    const { contaBancariaStore } = this.props;

    const response = await contaBancariaStore.findAllBanco({
      pageNumber: page,
      search
    });

    return {
      options: response.content,
      hasMore: !response.last,
      additional: {
        page: page + 1
      }
    };
  };

  render() {
    const { classes, open, contaBancariaStore } = this.props;
    const { objView, saving, opening } = contaBancariaStore;
    return (
      <Dialog open={open} maxWidth={"sm"} fullWidth={true}>
        <div className={classes.root}>
          <DialogHeader
            title={"Conta Bancária"}
            closeButton={true}
            actionClose={this.handleClose}
          />

          <DialogContent>
            {opening === true && (
              <Grid container justify="center" alignItems="center">
                <CircularProgress size={20} />
              </Grid>
            )}
            {opening === false && (
              <form onSubmit={this.handleConfirmar}>
                <Grid container>
                  <Grid item xs={12} className={classes.formGroup}>
                    <Typography color="primary" component="label">
                      Nome
                    </Typography>
                    <TextField
                      value={objView.nome || ""}
                      onChange={e => this.handleChange("nome", e)}
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.formGroup}>
                    <Typography color="primary" component="label">
                      Banco
                    </Typography>
                    <TextFieldSearch
                      placeholder=""
                      loadOptions={this.handleBancoLoadOptions}
                      withPaginate
                      value={objView.banco}
                      onChange={e => this.handleChange("banco", e)}
                      debounceTimeout={300}
                      additional={{
                        page: 0
                      }}
                    />
                  </Grid>
                  <Grid item xs={4} className={classes.formGroup}>
                    <Typography color="primary" component="label">
                      Saldo inicial
                    </Typography>
                    <TextField
                      disabled={this.props.isDisabled}
                      value={objView.saldoInicial || ""}
                      onChange={e => this.handleChange("saldoInicial", e)}
                      withCurrencyMask
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.formActions}>
                    <Grid container>
                      <Grid item xs={6} />
                      <Grid item xs={3} className={classes.inlineButtons}>
                        <ButtonClearPrimary onClick={this.handleClose}>Cancelar</ButtonClearPrimary>
                      </Grid>
                      <Grid item xs={3} className={classes.inlineButtons}>
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
        </div>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ContaBancariaModal);
