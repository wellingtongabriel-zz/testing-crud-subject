import React from "react";
import { withStyles } from "@material-ui/core/styles/index";
import { Typography, CircularProgress, Checkbox } from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";

import { TextField } from "../../../components/TextField";
import Dialog from "../../../components/Dialog/Dialog";
import DialogHeader from "../../../components/Dialog/DialogHeader";
import ButtonPrimary from "../../../components/Button/ButtonPrimary";
import string from "../../../utils/string";

class ConvenioFormModal extends React.Component {
    state = {
        convenio: {
            descricao: '',
            ativo: true,
            valorConsulta: null
        }
    }

    componentDidMount() {
        const { convenio } = this.props;

        if (convenio) {
            this.setState(prevState => ({
                convenio: { ...prevState.convenio, ...convenio }
            }));
        }
    }

    handleChange = event => {
        const { name, value, checked } = event.target;
        this.setState(prevState => ({
            convenio: {
                ...prevState.convenio,
                [name]: checked || value
            }
        }));
    }

    handleSave = () => {
        let convenio = this.state.convenio;

        if(convenio.valorConsulta) {
            convenio.valorConsulta = string.currencyMaskToFloat(convenio.valorConsulta.toString());
        }else{
            convenio.valorConsulta = null;
        }

        this.setState(prevState => ({
            convenio: convenio
        }));

        this.props.saveConvenio(this.state.convenio)
    }

    render() {
        const { show, classes, onClose, loadingSave } = this.props;
        const { convenio } = this.state;

        return (
            <Dialog
                open={show}
                maxWidth="sm"
                fullWidth
            >
                <div className={classes.root}>
                    <DialogHeader
                        title={!!convenio.id ? "Edição de Convênio" : "Novo convênio"}
                        closeButton
                        actionClose={onClose}
                    />
                    <DialogContent>
                        <Grid container>
                            <Grid item xs={12}>
                                <Grid container direction="row">
                                    <Grid
                                        item
                                        xs={6}
                                        className={(classes.formGroup, classes.divisoria)}
                                    >
                                        <Typography
                                            color="primary"
                                            component="label"
                                        >
                                            Nome
                                        </Typography>
                                        <TextField
                                            name="descricao"
                                            value={convenio.descricao}
                                            onChange={this.handleChange}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={5}
                                        className={classes.formGroup}
                                    >
                                        <Typography
                                            color="primary"
                                            component="label"
                                        >
                                            Valor
                                        </Typography>
                                        <TextField
                                            name="valorConsulta"
                                            withCurrencyMask
                                            value={convenio.valorConsulta}
                                            onChange={this.handleChange}
                                        />
                                    </Grid>


                                    <Grid
                                        item
                                        xs={12}
                                        className={classes.formGroup}
                                    >
                                        <div className={classes.space}>
                                            <Typography
                                                color="primary"
                                                component="label"
                                            >
                                                Status
                                            </Typography>
                                            <Checkbox
                                                name="ativo"
                                                checked={convenio.ativo}
                                                color="primary"
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                    </Grid>

                                    <Grid
                                        item
                                        xs={12}
                                        className={classes.space}
                                    >
                                        <Grid container>
                                            <Grid item xs={9} />
                                            <Grid
                                                item
                                                xs={3}
                                                className={
                                                    classes.inlineButtons
                                                }
                                            >
                                                <ButtonPrimary
                                                    onClick={this.handleSave}
                                                >
                                                    Salvar
                                                    {loadingSave && (
                                                        <CircularProgress
                                                            color="inherit"
                                                            size={12}
                                                            style={{ marginLeft: 10 }}
                                                        />
                                                    )}

                                                </ButtonPrimary>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </div>
            </Dialog>
        );
    }
}

const styles = theme => ({
    space: {
        marginTop: '15px'
    },
    divisoria: {
        marginRight: '15px'
    }
})

export default withStyles(styles)(ConvenioFormModal);
