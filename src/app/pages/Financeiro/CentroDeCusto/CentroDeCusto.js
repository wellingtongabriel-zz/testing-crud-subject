import React from "react";
import { inject, observer } from "mobx-react";
import debounce from "lodash.debounce";

import { withStyles } from "@material-ui/core/styles";

import Header from "../../../template/Header/Header";
import InputSearch from "../../../components/Input/Input";
import Table from "../../../components/Table/Table";
import Scroll from "../../../components/InfiniteScroll/Scroll";

import Grid from "@material-ui/core/Grid";

import GridItem from "../../../components/GridItem";

import styles from "../../../assets/jss/pages/centroDeCustoStyle";
import Profile from "../../../template/Header/Profile";
import CentroDeCustoModal from "./CentroDeCustoModal";
import ButtonFloat from "../../../components/ButtonFloat";

const columns = [
  {
    Header: "Nome",
    getValue: row => {
      return row.nome;
    }
  }
];

@inject("centroDeCustoStore")
@observer
class CentroDeCusto extends React.Component {
  constructor(props) {
    super(props);

    this.debounceConsulta = debounce(this.debounceConsulta, 500);
  }

  componentDidMount() {
    const { centroDeCustoStore } = this.props;

    centroDeCustoStore.findAll({ pageNumber: 0 });
  }

  debounceConsulta() {
    const { centroDeCustoStore } = this.props;

    centroDeCustoStore.findAll();
  }

  handleSearchChange = e => {
    const { centroDeCustoStore } = this.props;
    const search = e.target.value;
    centroDeCustoStore.currentPage = null;
    centroDeCustoStore.searchDTO.pageNumber = 0;
    centroDeCustoStore.searchDTO.search = search;
    this.debounceConsulta();
  };

  loadMore = () => {
    const { centroDeCustoStore } = this.props;

    centroDeCustoStore.findAll();
  };

  handleItemClick = id => {
    const { centroDeCustoStore } = this.props;

    centroDeCustoStore.edit(id);
  };

  render() {
    const { classes, centroDeCustoStore } = this.props;
    const {
      loading,
      centroCustoList,
      open,
      searchDTO,
      numberOfElements
    } = centroDeCustoStore;

    const hasMore = numberOfElements > 0;

    return (
      <div className={classes.content}>
        <Header padding>
          <Grid item xs={4}>
            <h3 className={classes.titleHeader}>Centro de Custos</h3>
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

        <div className={classes.tableContainer}>
          <div className={classes.search}>
            <GridItem xs={4}>
              <InputSearch
                onChange={this.handleSearchChange}
                value={searchDTO.search}
                placeholder="Pesquisar"
              />
            </GridItem>
          </div>
          {!loading && centroCustoList.length === 0 && (
            <div className={classes.notFoundContainer}>
              <h3>Nenhum item encontrado</h3>
            </div>
          )}
          {centroCustoList.length > 0 && (
            <Scroll
              loadMore={this.loadMore}
              hasMore={hasMore}
              pageStart={0}
              className={classes.scrollContainer}
            >
              <Table
                dados={centroCustoList}
                columns={columns}
                clickable={true}
                handleClick={this.handleItemClick}
              />
            </Scroll>
          )}
          <ButtonFloat onClick={() => centroDeCustoStore.openNew()} />
        </div>
        <CentroDeCustoModal open={open} />
      </div>
    );
  }
}

export default withStyles(styles)(CentroDeCusto);
