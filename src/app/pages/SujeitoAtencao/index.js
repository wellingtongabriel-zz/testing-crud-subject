import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import { inject, observer } from "mobx-react";
import React from 'react';
import styles from "../../assets/jss/pages/sujeitoAtencaoStyle";
import ButtonFloat from "../../components/ButtonFloat";
import Header from "../../template/Header/Header";
import Profile from "../../template/Header/Profile";
import SujeitoAtencaoLista from './Listagem/index';

@inject("sujeitoAtencaoStore")
@observer
class SujeitoAtencao extends React.Component {

    render () {

        const { classes, sujeitoAtencaoStore } = this.props;

        return (
            <React.Fragment>
                <div className={classes.content}>
                    <Header padding>
                        <Grid item xs={4}>
                            <h3 className={classes.titleHeader}>Sujeito de Atenção</h3>
                        </Grid>

                        <Grid item xs={8}>
                            <Grid container justify={"space-between"} alignItems={"center"}>
                                <Grid item />

                                <Grid item>
                                    <Profile />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Header>
                    
                    <SujeitoAtencaoLista />

                    <ButtonFloat 
                        onClick={() => sujeitoAtencaoStore.openNew()} />
                </div>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(SujeitoAtencao);