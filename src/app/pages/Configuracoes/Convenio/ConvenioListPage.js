import React from "react";
import { inject } from 'mobx-react';
import {
    Grid,
    CircularProgress,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles/index";

import { findAllConvenio, saveConvenio, findByIdConvenio } from '../../../services/ConvenioService';

import Header from "../../../template/Header/Header";
import Profile from "../../../template/Header/Profile";
import ButtonFloat from "../../../components/ButtonFloat";
import Input from "../../../components/Input/Input";
import Notification from "../../../components/Notification";
import ConvenioFormModal from "./ConvenioFormModal"; 
import ConvenioTable from "./ConvenioTable";
import { db } from "../../../config/config";

const styleLoadingCenter = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "700px"
};

const Loading = () => (
    <div style={styleLoadingCenter}>
        <CircularProgress color="primary" size={32} />
    </div>
);

const ContainerAndButtonCreate = ({ children, create, classes }) => (
    <>
        <Grid
            container
            direction="column"
            className={classes.containerColumn}
            wrap="nowrap"
        >
            <Grid
                item
                xs={12}
                container
                direction="row"
                wrap="nowrap"
            >
                <Grid item container direction="column" wrap="nowrap">
                    {children}
                </Grid>
            </Grid>
            <ButtonFloat onClick={create} />
        </Grid>
    </>
);

@inject('convenioStore')
class ConvenioListPage extends React.Component {
    state = {
        search: "",
        isLoading: false,
        convenios: [],
        showModal: false,
        convenioSelected: undefined,
        keyConvenio: 0,
        loadingSave: false
    };

    componentDidMount() {
        this.loadConvenios();
    }

    loadConvenios = () => {
        this.setState({ isLoading: true });
        findAllConvenio()
            .then(({ data: response }) => {
                this.setState({
                    convenios: response.data.findAllConvenio.content
                });
            })
            .catch(error => {
                this.props.convenioStore.openNotification(
                    "Erro ao carregar lista de convênios",
                    "error"
                );
            })
            .finally(() => {
                this.setState({ isLoading: false });
            });
    }

    handleChange = e => this.setState({ search: e.target.value });

    editConvenioById = id => {
        this.setState({ isLoading: false });
        findByIdConvenio(id)
            .then(({ data: response }) => {
                this.setState({
                    convenioSelected: response.data.findByIdConvenio,
                    showModal: true
                })
            })
            .catch(error => {
                this.props.convenioStore.openNotification(
                    "Erro ao carregar convênio",
                    "error"
                );
            })
            .finally(() => {
                this.setState({ isLoading: false })
            });
    };

    save = convenio => {
        this.setState({ loadingSave: true });
        saveConvenio(convenio)
            .then(() => {
                this.setState({ showModal: false, convenioSelected: undefined });
                this.loadConvenios();
            })
            .catch(error => {
                this.props.convenioStore.openNotification(
                    "Erro ao salvar convênio",
                    "error"
                );
            })
            .finally(() => {
                this.setState({ loadingSave: false });
            });
    }

    onCloseModal = () => {
        this.setState({ showModal: false });
    }

    create = () => {
        db.get("usuarioLogado", "{}").then(usuarioLogado => {
            const unidade = JSON.parse(usuarioLogado).unidadeAtual;
            this.setState({ showModal: true, convenioSelected: { unidade } });
        })
    }
    
    handleClose = (reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.props.convenioStore.closeNotification();
    };

    render() {
        const { search, isLoading, convenios, showModal, convenioSelected, loadingSave } = this.state;
        const { classes, convenioStore } = this.props;

        const newForm = convenioSelected && (convenioSelected.id || (convenioSelected.unidade && convenioSelected.unidade.id));

        return (
            <>
                <ConvenioFormModal 
                    key={newForm}
                    show={showModal} 
                    convenio={convenioSelected}
                    onClose={this.onCloseModal} 
                    saveConvenio={this.save}
                    loadingSave={loadingSave}
                />
                <ContainerAndButtonCreate create={this.create} classes={classes}>
                    <Grid className={classes.container} item>
                        <Header>
                            <Grid item xs={12}>
                                <Grid
                                    container
                                    justify="space-between"
                                    alignItems="center"
                                >
                                    <Grid item xs={8}>
                                        <h3 className={classes.titleHeader}>
                                            Convênios
                                        </h3>
                                    </Grid>

                                    <Grid item>
                                        <Profile />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Header>
                        <Grid item>
                            <Grid className={classes.search}>
                                <Input
                                    name="search"
                                    onChange={this.handleChange}
                                    value={search}
                                    placeholder="Pesquisar"
                                />
                            </Grid>
                        </Grid>

                        {isLoading ? <Loading /> : (
                            <ConvenioTable 
                                search={search} 
                                convenios={convenios}
                                onClickRow={this.editConvenioById} 
                            />
                        )}
                    </Grid>
                </ContainerAndButtonCreate>

                <Notification
                    close={this.handleClose}
                    reset={convenioStore.resetNotification}
                    isOpen={convenioStore.notification.isOpen}
                    variant={convenioStore.notification.variant}
                    message={convenioStore.notification.message}
                />
            </>
        );
    }
}

const style = theme => ({
    containerColumn: {
        position: "relative"
    },
    container: {
        margin: "0 84px 20px"
    },
    search: {
        maxWidth: "700px",
        margin: "15px 0"
    },
    titleHeader: {
        fontSize: "1.2rem",
        fontWeight: "bold",
        color: theme.palette.primary.main,
        marginRight: "15px"
    },
});

export default withStyles(style)(ConvenioListPage);
