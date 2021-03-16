import React from 'react'
import { withStyles } from '@material-ui/core/styles';

import { Card, CardContent, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import { KeyboardArrowRight } from "@material-ui/icons"

import { AuthApi } from "../config/api";

import selectRedeStyle from '../assets/jss/pages/selectRedeStyle'
import { createMutation } from "./Querys";
import { inject } from 'mobx-react';
import localStorageService, { USUARIO_LOGADO_KEY, REDES_KEY } from '../services/storage';
import { findUnidadeLogada } from '../services/UnidadeService';

@inject('filtroHeaderStore')
class SelectRede extends React.Component {
    state = {
        redes: []
    };

    componentDidMount() {
        if (this.props.location.state && this.props.location.state.redes) {
            this.setState({ redes: this.props.location.state.redes });
        } else {
            this.props.history.push('/login');
        }
    }

    async handleClick(item) {

        AuthApi.post('graphql',
            JSON.stringify({
                query: createMutation({
                    name: `alterarUnidadeAtual`,
                    objType: 'Long',
                    objName: 'idUnidade',
                    attrsReturn: `
                        id
                        nome
                        login
                        unidadeAtual {
                            id
                            nome
                            cnpj
                            rede {
                                id
                                nome
                            }
                        }
                        profissionalSaudeAtual {
                            id,
                            nome,
                            cns,
                            cpf
                        }
                        authorities {
                            authority
                        }
                    `
                }, 'mutation'),
                variables: { idUnidade: item.id }
            })
        ).then(async (response) => {
            localStorageService.set(USUARIO_LOGADO_KEY, response.data.data.alterarUnidadeAtual);
            localStorageService.set(REDES_KEY, this.state.redes);

            await findUnidadeLogada();

            this.props.history.push('/');
            this.props.filtroHeaderStore.unidade = 0;
            this.props.filtroHeaderStore.profissionalSaude = 0;
        });
    };

    render() {
        const { classes } = this.props;
        const { redes } = this.state;

        return (
            <div className={classes.main}>
                <div className={classes.container}>

                    <h1 className={classes.title}>Selecione uma unidade:</h1>
                    {redes.map((rede, index) => (
                        <Card key={index} className={classes.card}>
                            <CardContent>

                                <p className={classes.nameRede}>{rede.nome}</p>
                            </CardContent>

                            <List>
                                {rede.unidades.map((unidade, index) => (
                                    <ListItem key={index} button onClick={() => this.handleClick(unidade)}>

                                        <ListItemText primary={unidade.nome} />

                                        <ListItemSecondaryAction>

                                            <IconButton aria-label="Comments">
                                                <KeyboardArrowRight />
                                            </IconButton>
                                        </ListItemSecondaryAction>

                                    </ListItem>
                                ))}
                            </List>


                        </Card>
                    ))}


                </div>
            </div>
        )
    }
}

export default withStyles(selectRedeStyle)(SelectRede);
