import React from "react";

import { withStyles } from "@material-ui/core/styles";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";

import Dialog from "../../../components/Dialog/Dialog";
import DialogHeader from "../../../components/Dialog/DialogHeader";
import { TextField } from "../../../components/TextField";
import { Typography, CircularProgress } from "@material-ui/core";
import ButtonClearPrimary from "../../../components/Button/ButtonClearPrimary";
import ButtonPrimary from "../../../components/Button/ButtonPrimary";
import { inject, observer } from "mobx-react";
import string from "../../../utils/string";

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

@inject("centroDeCustoStore")
@observer
class CentroDeCustoModal extends React.Component {
  handleChange = (field, event) => {
    const { centroDeCustoStore } = this.props;
    centroDeCustoStore.objView[field] = event.target.value;
  };

  handleClose = () => {
    const { onClose, centroDeCustoStore } = this.props;

    centroDeCustoStore.closeModal();

    if (typeof onClose === "function") {
      onClose();
    }
  };

  handleConfirmar = async e => {
    try {
      e.preventDefault();

      const { centroDeCustoStore } = this.props;

      const centroCusto = {
        ...centroDeCustoStore.objView
      };

      if (centroDeCustoStore.saving) {
        return;
      }

      if (string.isEmpty(centroCusto.nome)) {
        return;
      }

      await centroDeCustoStore.save(centroCusto);
      centroDeCustoStore.closeModal();
      centroDeCustoStore.centroCustoList = [];
      centroDeCustoStore.currentPage = null;
      centroDeCustoStore.searchDTO.pageNumber = 0;
      centroDeCustoStore.findAll();
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { classes, open, centroDeCustoStore } = this.props;
    const { objView, saving, opening } = centroDeCustoStore;

    return (
      <Dialog open={open} maxWidth={"sm"} fullWidth={true}>
        <div className={classes.root}>
          <DialogHeader
            title={"Centro de Custo"}
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
                  <Grid item xs={12} className={classes.formActions}>
                    <Grid container>
                      <Grid item xs={6} />
                      <Grid item xs={3} className={classes.inlineButtons}>
                        <ButtonClearPrimary onClick={this.handleClose}>
                          Cancelar
                        </ButtonClearPrimary>
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

export default withStyles(styles)(CentroDeCustoModal);
