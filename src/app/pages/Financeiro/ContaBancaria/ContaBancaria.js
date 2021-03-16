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

import styles from "../../../assets/jss/pages/contaBancariaStyle";
import Profile from "../../../template/Header/Profile";
import ContaBancariaModal from "./ContaBancariaModal";
import ButtonFloat from "../../../components/ButtonFloat";
import { applyCurrencyMask } from "../../../utils/CurrencyMask";

const columns = [
  {
    Header: "Nome",
    getValue: row => {
      return row.nome;
    },
    props: { center: "left" }
  },
  {
    Header: "Banco",
    getValue: row => {
      return row.banco && row.banco.nome;
    },
    props: { center: "true" }
  },
  {
    Header: "Saldo Inicial",
    getValue: row => {
      if (typeof row.saldoInicial !== "number") {
        return "-";
      }
      return applyCurrencyMask(row.saldoInicial);
    },
    props: { center: "true" }
  }
];

@inject("contaBancariaStore")
@observer
class ContaBancaria extends React.Component {
  constructor(props) {
    super(props);

    this.debounceConsulta = debounce(this.debounceConsulta, 500);
    this.state = {
      isDisabled: true
    }
  }

  componentDidMount() {
    const { contaBancariaStore } = this.props;

    contaBancariaStore.findAll({ pageNumber: 0 });
  }

  debounceConsulta() {
    const { contaBancariaStore } = this.props;

    contaBancariaStore.findAll();
  }

  handleSearchChange = e => {
    const { contaBancariaStore } = this.props;
    const search = e.target.value;
    contaBancariaStore.currentPage = null;
    contaBancariaStore.searchDTO.pageNumber = 0;
    contaBancariaStore.searchDTO.search = search;
    this.debounceConsulta();
  };

  loadMore = () => {
    const { contaBancariaStore } = this.props;

    contaBancariaStore.findAll();
  };

  handleItemClick = id => {
    const { contaBancariaStore } = this.props;

    contaBancariaStore.edit(id);
  };

  disableSaldoInicial = (disable) => {
    this.setState({
      isDisabled: disable
    })
  }

  render() {
    const { classes, contaBancariaStore } = this.props;
    const {
      loading,
      contaBancariaList,
      open,
      searchDTO,
      numberOfElements
    } = contaBancariaStore;

    const hasMore = numberOfElements > 0;

    return (
      <div className={classes.content}>
        <Header padding>
          <Grid item xs={4}>
            <h3 className={classes.titleHeader}>Contas Bancárias</h3>
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

          {!loading && contaBancariaList.length === 0 && (
            <div className={classes.notFoundContainer}>
              <h3>Nenhum item encontrado</h3>
            </div>
          )}
          {contaBancariaList.length > 0 && (
            <Scroll
              loadMore={this.loadMore}
              hasMore={hasMore}
              pageStart={0}
              className={classes.scrollContainer}
            >
              <Table
                dados={contaBancariaList}
                columns={columns}
                clickable={true}
                handleClick={this.handleItemClick}
              />
            </Scroll>
          )}
          <ButtonFloat onClick={() => {
            this.disableSaldoInicial(false)
            contaBancariaStore.openNew()
          }} />
        </div>
        <ContaBancariaModal disableSaldoInicial={this.disableSaldoInicial} isDisabled={this.state.isDisabled} open={open} />
      </div>
    );
  }
}

export default withStyles(styles)(ContaBancaria);
