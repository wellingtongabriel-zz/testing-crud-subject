import { CircularProgress, Typography, withStyles } from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import { inject, observer } from "mobx-react";
import React from 'react';
import ButtonClearPrimary from '../../../components/Button/ButtonClearPrimary';
import ButtonPrimary from '../../../components/Button/ButtonPrimary';
import Dialog from '../../../components/Dialog/Dialog';
import DialogHeader from '../../../components/Dialog/DialogHeader';
import InputDateForm from "../../../components/Input/InputDateForm";
import { InputPhoneForm } from '../../../components/Input/InputPhoneForm';
import Notification from "../../../components/Notification";
import SelectForm from '../../../components/Select/Select';
import { TextField } from "../../../components/TextField";
import string from '../../../utils/string';

const styles = () => ({
    formControlSelect: {
        width: '100%'
    },
    formGroup: {
        padding: 5
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

@inject("sujeitoAtencaoStore")
@inject("unidadeStore")
@observer
class CriacaoSujeitoAtencao extends React.Component {

    componentDidMount() {
        const { unidadeStore, sujeitoAtencaoStore } = this.props;
        
        unidadeStore.getUnidadeLogada();
        sujeitoAtencaoStore.findAll();
        
        sujeitoAtencaoStore.resetNotification();
        sujeitoAtencaoStore.errors = {
            nome: false,
            dataNascimento: false,
            cpf: false,
            telefonePrincipal: false,
            email: false,
            municipio: false
        };
    };

    handleChange = (campo, valor) => {
        const { sujeitoAtencaoStore } = this.props;
        sujeitoAtencaoStore.objView[campo] = valor;
    };

    handleClose = () => {
        const { onClose, sujeitoAtencaoStore } = this.props;
        sujeitoAtencaoStore.closeModal();

        if (typeof onClose === "function") {
            onClose();
        } 
    };

    handleConfirmar = e => {
        try {

            e.preventDefault();
        
            const { sujeitoAtencaoStore } = this.props;
            sujeitoAtencaoStore.saveSujeitoAtencao();

        } catch(error) {
            console.warn(error && error.message);
        }
    };

    render() {

        const { classes, sujeitoAtencaoStore, unidadeStore } = this.props;
        const { objView, errors, open, opening } = sujeitoAtencaoStore;
        const { municipios } = unidadeStore;

        return (
            <Dialog open={open} maxWidth={"sm"} fullWidth={true}>
                <div>
                    <DialogHeader
                        title={"Criação de Sujeito de Atenção"}
                        closeButton={true}
                        actionClose={this.handleClose} />

                    <DialogContent>

                    {opening && (
                        <Grid container justify="center" alignItems="center">
                            <CircularProgress size={20} />
                        </Grid>
                    )}

                    {
                        !opening && (
                            <form onSubmit={this.handleConfirmar}>
                                <Grid container>
                                    <Grid item xs={12} className={classes.formGroup}>
                                        <Typography color="primary" component="label"> Nome </Typography>
                                        <TextField
                                            error={errors.nome}
                                            value={objView.nome}
                                            onChange={e => this.handleChange('nome', e.target.value)} />
                                    </Grid>

                                    <Grid item xs={12} className={classes.formGroup}>
                                        <Typography color="primary" component="label"> CPF </Typography>
                                        <TextField
                                            error={errors.cpf}
                                            value={objView.cpf}
                                            onChange={e => this.handleChange('cpf', string.cpfMask(e.target.value))} />
                                    </Grid>

                                    <Grid item xs={6} className={classes.formGroup}>
                                        <Typography color="primary" component="label"> Data de Nascimento </Typography>
                                        <InputDateForm
                                            error={errors.dataNascimento}
                                            variant="outlined"
                                            fullWidth
                                            value={objView.dataNascimento}
                                            onChange={e => this.handleChange("dataNascimento", e)}/>
                                    </Grid>

                                    <Grid item xs={6} className={classes.formGroup}>
                                        <Typography color="primary" component="label"> Email </Typography>
                                        <TextField
                                            error={errors.email}
                                            value={objView.email}
                                            onChange={e => this.handleChange('email', e.target.value)} />
                                    </Grid>

                                    <Grid item xs={6} className={classes.formGroup}>
                                        <Typography color="primary" component="label"> Telefone Principal </Typography>
                                        <InputPhoneForm
                                            error={errors.telefonePrincipal}
                                            value={objView.telefonePrincipal}
                                            onChange={e => this.handleChange('telefonePrincipal', e.target.value)} />
                                    </Grid>

                                    <Grid item xs={6} className={classes.formGroup}>
                                        <Typography color="primary" component="label"> Município </Typography>
                                        <SelectForm
                                            onChange={e => this.handleChange('municipio', e.target.value)}
                                            value={objView.municipio}
                                            elements={municipios}
                                            selectedItemColor="primary"
                                            formControlProps={{ className: classes.formControlSelect }} />
                                    </Grid>
                                </Grid>
                                
                                <Grid item xs={12} className={classes.formActions}>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Grid item xs={3} className={classes.inlineButtons}>
                                                <ButtonClearPrimary onClick={this.handleClose}> Cancelar </ButtonClearPrimary>
                                            </Grid>

                                            <Grid item xs={3} className={classes.inlineButtons}>
                                                <ButtonPrimary
                                                    type="submit"
                                                    onClick={this.handleConfirmar}> Confirmar </ButtonPrimary>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </form>
                        )
                    }
                        
                    </DialogContent>

                    <Notification
                        close={(event, reason) => sujeitoAtencaoStore.closeNotification(event, reason)}
                        reset={() => sujeitoAtencaoStore.resetNotification()}
                        isOpen={sujeitoAtencaoStore.notification.isOpen}
                        variant={sujeitoAtencaoStore.notification.variant}
                        message={sujeitoAtencaoStore.notification.message}/>
                </div>
            </Dialog>
        )
    }
}

export default withStyles(styles)(CriacaoSujeitoAtencao);
