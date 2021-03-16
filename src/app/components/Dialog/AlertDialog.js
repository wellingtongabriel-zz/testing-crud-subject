import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ButtonAlert from "../Button/ButtonAlert";
import ButtonClearPrimary from "../Button/ButtonClearPrimary";
import { withStyles, CircularProgress, Grid } from "@material-ui/core";

const buttonStyle = {
  maxWidth: 158
};

const styles = theme => ({
  alertContainer: {
    minWidth: 500
  },
  alertTitle: {
    "& h6": {
      fontSize: 16,
      textAlign: "center"
    }
  },
  alertDescription: {
    lineHeight: "normal",
    textAlign: "center",
    fontSize: 14,
    color: theme.palette.commons.fontColor
  },
  containerButtons: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15
  },
  buttonCancel: {
    ...buttonStyle,
    marginRight: 5
  },
  buttonOk: {
    ...buttonStyle,
    marginLeft: 5
  }
});

const AlertDialog = ({
  open,
  onClose,
  onCancel,
  onOk,
  alertDescription,
  alertTitle,
  classes,
  loadingOk,
  loadingCancel
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <div className={classes.alertContainer}>
      {alertTitle && (
        <DialogTitle className={classes.alertTitle}>{alertTitle}</DialogTitle>
      )}
      {alertDescription && (
        <DialogContent>
          <DialogContentText className={classes.alertDescription}>
            {alertDescription}
          </DialogContentText>
        </DialogContent>
      )}
      <DialogActions style={{ textAlign: "center" }}>
        <Grid container className={classes.containerButtons}>
          <Grid item xs={12}>
            <ButtonClearPrimary
              className={classes.buttonCancel}
              onClick={onCancel}
              disabled={loadingCancel}
            >
              <React.Fragment>
                Não
                {loadingCancel && (
                  <CircularProgress
                    color="primary"
                    size={12}
                    style={{ marginLeft: 10 }}
                  />
                )}
              </React.Fragment>
            </ButtonClearPrimary>
            <ButtonAlert
              className={classes.buttonOk}
              onClick={onOk}
              autoFocus
              disabled={loadingOk}
            >
              <React.Fragment>
                Sim
                {loadingOk && (
                  <CircularProgress
                    color="inherit"
                    size={12}
                    style={{ marginLeft: 10 }}
                  />
                )}
              </React.Fragment>
            </ButtonAlert>
          </Grid>
        </Grid>
      </DialogActions>
    </div>
  </Dialog>
);

export default withStyles(styles)(AlertDialog);
