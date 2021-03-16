import React from "react";
import debounce from "lodash.debounce";
import { inject, observer } from "mobx-react";

import { withStyles } from "@material-ui/core/styles";

import Header from "../../../template/Header/Header";
import InputSearch from "../../../components/Input/Input";
import Table from "../../../components/Table/Table";
import Scroll from "../../../components/InfiniteScroll/Scroll";

import Grid from "@material-ui/core/Grid";

import GridItem from "../../../components/GridItem";

import styles from "../../../assets/jss/pages/categoriaFinanceiraStyle";
import Profile from "../../../template/Header/Profile";
import CategoriaModal from "./CategoriaModal";
import ButtonFloat from "../../../components/ButtonFloat";
import { Typography } from "@material-ui/core";
import string from "../../../utils/string";

const getColumns = props => {
  const handleItemClick = id => {
    const { categoriaFinanceiraStore } = props;
    categoriaFinanceiraStore.edit(id);
  };

  return [
    {
      Header: "Nome",
      getValue: row => {
        return (
          <React.Fragment>
            <Typography
              component="strong"
              onClick={() => handleItemClick(row.id)}
            >
              {row.nome}
            </Typography>
            {row.categoriasFinanceiras
              ? row.categoriasFinanceiras.map(item => (
                  <Typography
                    component="p"
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                  >
                    {item.nome}
                  </Typography>
                ))
              : null}
          </React.Fragment>
        );
      }
    },
    {
      Header: "Tipo",
      getValue: row => {
        return string.capitalize(row.tipo);
      }
    }
  ];
};

@inject("categoriaFinanceiraStore")
@observer
class Categoria extends React.Component {
  constructor(props) {
    super(props);

    this.debounceConsulta = debounce(this.debounceConsulta, 500);
  }

  componentDidMount() {
    const { categoriaFinanceiraStore } = this.props;

    categoriaFinanceiraStore.findAll({ pageNumber: 0 });
  }

  debounceConsulta() {
    const { categoriaFinanceiraStore } = this.props;

    categoriaFinanceiraStore.findAll();
  }

  handleSearchChange = e => {
    const { categoriaFinanceiraStore } = this.props;
    const search = e.target.value;
    categoriaFinanceiraStore.currentPage = null;
    categoriaFinanceiraStore.searchDTO.pageNumber = 0;
    categoriaFinanceiraStore.searchDTO.search = search;
    this.debounceConsulta();
  };

  loadMore = () => {
    const { categoriaFinanceiraStore } = this.props;

    categoriaFinanceiraStore.findAll();
  };

  render() {
    const { classes, categoriaFinanceiraStore } = this.props;
    const {
      loading,
      categoriaFinanceiraList,
      open,
      searchDTO,
      numberOfElements
    } = categoriaFinanceiraStore;

    const hasMore = numberOfElements > 0;

    return (
      <div className={classes.content}>
        <Header padding>
          <Grid item xs={4}>
            <h3 className={classes.titleHeader}>Categorias Financeiras</h3>
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

          {!loading && categoriaFinanceiraList.length === 0 && (
            <div className={classes.notFoundContainer}>
              <h3>Nenhum item encontrado</h3>
            </div>
          )}
          {categoriaFinanceiraList.length > 0 && (
            <Scroll
              loadMore={this.loadMore}
              hasMore={hasMore}
              pageStart={0}
              className={classes.scrollContainer}
            >
              <Table
                dados={categoriaFinanceiraList}
                clickable={true}
                columns={getColumns(this.props)}
              />
            </Scroll>
          )}
          <ButtonFloat onClick={() => categoriaFinanceiraStore.openNew()} />
        </div>
        <CategoriaModal open={open} />
      </div>
    );
  }
}

export default withStyles(styles)(Categoria);
