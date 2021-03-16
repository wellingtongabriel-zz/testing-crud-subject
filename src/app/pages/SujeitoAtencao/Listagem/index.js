
import { withStyles } from "@material-ui/core/styles";
import debounce from "lodash.debounce";
import { inject, observer } from "mobx-react";
import React from 'react';
import styles from "../../../assets/jss/pages/sujeitoAtencaoStyle";
import GridItem from "../../../components/GridItem";
import Scroll from "../../../components/InfiniteScroll/Scroll";
import InputSearch from "../../../components/Input/Input";
import Table from "../../../components/Table/Table";
import CriacaoSujeitoAtencao from '../Criacao/index';
import { getColumns } from './colunas';

@inject("sujeitoAtencaoStore")
@observer
class SujeitoAtencaoLista extends React.Component {

    constructor(props) {
        super(props)
        this.debounceConsulta = debounce(this.debounceConsulta, 500);
    }

    componentDidMount() {
        const { sujeitoAtencaoStore } = this.props;
        sujeitoAtencaoStore.findAll({ pageNumber: 0 });
    }

    loadMore = () => {
        const { sujeitoAtencaoStore } = this.props;
        sujeitoAtencaoStore.findAll();
    };

    handleSearchChange = e => {
        const { sujeitoAtencaoStore } = this.props;

        sujeitoAtencaoStore.currentPage = null;
        sujeitoAtencaoStore.searchDTO.pageNumber = 0;
        sujeitoAtencaoStore.searchDTO.search = e.target.value;
        
        this.debounceConsulta();
    };

    debounceConsulta() {
        const { sujeitoAtencaoStore } = this.props;
        sujeitoAtencaoStore.findAll();
    }

    render() {

        const { classes, sujeitoAtencaoStore } = this.props;
        const { searchDTO, loading, sujeitoAtencaoItems, numberOfElements } = sujeitoAtencaoStore;
        const hasMore = numberOfElements > 0;

        return (
            <>
                <div className={classes.tableContainer}>
                    <div className={classes.search}>
                        <GridItem xs={4}>
                            <InputSearch
                                onChange={this.handleSearchChange}
                                value={searchDTO.search}
                                placeholder="Pesquisar"/>
                        </GridItem>
                    </div>

                    {!loading && sujeitoAtencaoItems.length === 0 && (
                        <div className={classes.notFoundContainer}>
                            <h3>Nenhum item encontrado</h3>
                        </div>
                    )}

                    {
                        sujeitoAtencaoItems.length > 0 && (
                            <Scroll
                                loadMore={this.loadMore}
                                hasMore={hasMore}
                                pageStart={0}
                                className={classes.scrollContainer}>
                                <Table
                                    dados={sujeitoAtencaoItems}
                                    clickable={true}
                                    columns={getColumns(this.props, sujeitoAtencaoStore)} />
                            </Scroll>
                        )
                    }

                </div>

                <CriacaoSujeitoAtencao />
            </>
        );
    }
}

export default withStyles(styles)(SujeitoAtencaoLista);