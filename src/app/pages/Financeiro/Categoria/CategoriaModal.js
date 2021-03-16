import React from "react";
import { inject, observer } from "mobx-react";

import { withStyles } from "@material-ui/core/styles/index";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";

import Dialog from "../../../components/Dialog/Dialog";
import DialogHeader from "../../../components/Dialog/DialogHeader";
import { TextField, TextFieldSearch } from "../../../components/TextField";
import {
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress
} from "@material-ui/core";
import ButtonClearPrimary from "../../../components/Button/ButtonClearPrimary";
import ButtonPrimary from "../../../components/Button/ButtonPrimary";
import { CategoriaFinanceiraTipo } from "../../../stores/Financeiro/CategoriaFinanceira.store";

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

@inject("categoriaFinanceiraStore")
@observer
class CategoriaModal extends React.Component {
  handleChange = (field, event) => {
    const { categoriaFinanceiraStore } = this.props;

    if (field === "categoriaFinanceiraPai") {
      categoriaFinanceiraStore.objView[field] = event;
      return;
    }
    
    if (field === "tipo") {
      categoriaFinanceiraStore.objView.categoriaFinanceiraPai = null;
      categoriaFinanceiraStore.objView[field] = event;
      return;
    }

    categoriaFinanceiraStore.objView[field] = event.target.value;
  };

  handleClose = () => {
    const { onClose, categoriaFinanceiraStore } = this.props;

    categoriaFinanceiraStore.closeModal();

    if (typeof onClose === "function") {
      onClose();
    }
  };

  handleConfirmar = async e => {
    try {
      e.preventDefault();

      const { categoriaFinanceiraStore } = this.props;

      const categoriaFinanceira = {
        ...categoriaFinanceiraStore.objView
      };

      await categoriaFinanceiraStore.save(categoriaFinanceira);
      categoriaFinanceiraStore.closeModal();
      categoriaFinanceiraStore.categoriaFinanceiraList = [];
      categoriaFinanceiraStore.currentPage = null;
      categoriaFinanceiraStore.searchDTO.pageNumber = 0;
      categoriaFinanceiraStore.findAll();
    } catch (error) {
      console.warn(error && error.message);
    }
  };

  handleCategoriaFinanceiraPaiLoadOptions = async (
    search,
    loadedOptions,
    { page }
  ) => {
    const { categoriaFinanceiraStore } = this.props;

    const response = await categoriaFinanceiraStore.findCategoriasFinanceirasPais(
      {
        pageNumber: page,
        // search
      },
      categoriaFinanceiraStore.objView.tipo
    );

    return {
      options: response.content,
      hasMore: !response.last,
      additional: {
        page: page + 1
      }
    };
  };

  render() {
    const { classes, open, categoriaFinanceiraStore } = this.props;
    const { objView, saving, opening } = categoriaFinanceiraStore;
    const isEditing = objView && objView.id ? true : false;

    return (
      <Dialog open={open} maxWidth={"sm"} fullWidth={true}>
        <div className={classes.root}>
          <DialogHeader
            title={"Categoria Financeira"}
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
                      Tipo
                    </Typography>
                    <FormGroup row style={{ marginLeft: -15 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={objView.tipo === CategoriaFinanceiraTipo.RECEITA}
                            onChange={() => this.handleChange("tipo", CategoriaFinanceiraTipo.RECEITA)}
                            color="primary"
                            disabled={isEditing}
                          />
                        }
                        label="Receita"
                        labelPlacement="start"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={objView.tipo === CategoriaFinanceiraTipo.DESPESA}
                            onChange={() => this.handleChange("tipo", CategoriaFinanceiraTipo.DESPESA)}
                            color="primary"
                            disabled={isEditing}
                          />
                        }
                        label="Despesa"
                        labelPlacement="start"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12} className={classes.formGroup}>
                    <Typography color="primary" component="label">
                      Categoria pai
                    </Typography>
                    <TextFieldSearch 
                      cacheUniq={objView.tipo}
                      placeholder=""
                      loadOptions={this.handleCategoriaFinanceiraPaiLoadOptions}
                      withPaginate
                      value={objView.categoriaFinanceiraPai}
                      onChange={e => this.handleChange("categoriaFinanceiraPai", e)}
                      debounceTimeout={300}
                      additional={{
                        page: 0
                      }}
                      isDisabled={isEditing && !objView.categoriaFinanceiraPai}
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.formGroup}>
                    <Typography color="primary" component="label">
                      Nome
                    </Typography>
                    <TextField
                      value={objView.nome || ""}
                      onChange={e => this.handleChange("nome", e)}
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

export default withStyles(styles)(CategoriaModal);
