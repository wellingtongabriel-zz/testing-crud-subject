import React from "react";
import debounce from "lodash.debounce";
import moment from "moment";
import 'moment/locale/pt-br';
import classnames from "classnames";
import {inject, observer} from "mobx-react";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

import {withStyles} from "@material-ui/core/styles";

import RSC from "react-scrollbars-custom";
import Header from "../../../template/Header/Header";
import InputSearch from "../../../components/Input/Input";
import Table from "../../../components/Table/Table";

import Grid from "@material-ui/core/Grid";

import styles from "../../../assets/jss/pages/extratoStyle";
import Profile from "../../../template/Header/Profile";
import ExtratoModal from "./ExtratoModal";
import {applyCurrencyMask} from "../../../utils/CurrencyMask";
import string from "../../../utils/string";
import {
    TituloTipoRepeticao,
    TituloTipo
} from "../../../stores/Financeiro/Extrato.store";
import SpeedDials from "../../../components/SpeedDials";
import InputDateForm from "../../../components/Input/InputDateForm";
import {SelectSearch} from "../../../components/Select/SelectSearch";

const columns = [
    {
        Header: "",
        getValue: row => {
            if (typeof row.tipo !== "string") {
                return "";
            }
            return <div className={classnames("tipo", row.tipo.toLowerCase())}/>;
        }
    },
    {
        Header: "Data",
        getValue: row => {
            if (string.isEmpty(row.dataVencimento)) {
                return "-";
            }
            return moment(row.dataVencimento).format("DD/MM/YYYY");
        }
    },
    {
        Header: "Descrição",
        getValue: ({nome, numeroParcela, tipoRepeticao, totalParcelas}) => {
            if (tipoRepeticao === TituloTipoRepeticao.NAO_REPETIR) {
                return nome;
            }
            return `${
                numeroParcela === 0 ? "E" : numeroParcela
            }/${totalParcelas} ${nome}`;
        }
    },
    {
        Header: "Categoria",
        getValue: row => {
            if (row.categoriaFinanceira && row.categoriaFinanceira.nome) {
                return row.categoriaFinanceira.nome;
            }
            return "-";
        }
    },
    {
        Header: "Valor",
        getValue: row => {
            if (typeof row.valor !== "number") {
                return "-";
            }
            return applyCurrencyMask(row.valor);
        }
    },
    {
        Header: "Saldo",
        getValue: row => {
            if (typeof row.saldo !== "number") {
                return "-";
            }
            return applyCurrencyMask(row.saldo);
        }
    }
];

@inject("extratoStore", "profissionalSaudeStore", "usuarioStore")
@observer
class Extrato extends React.Component {
    constructor(props) {
        super(props);
        this.carregaProfissionaisSaude();
        this.debounceConsulta = debounce(this.debounceConsulta, 500);

        this.state = {
            filterDateSelected: moment(),
            profissionalSaude: null
        }
    }

    componentDidMount() {
        const {extratoStore} = this.props;

        extratoStore.findAll();
    }

    debounceConsulta() {
        const {extratoStore} = this.props;

        extratoStore.findAll();
    }

    async carregaProfissionaisSaude() {
        const {profissionalSaudeStore, usuarioStore} = this.props;
        const unidadeLogada = await usuarioStore.getUnidadeAtual();

        profissionalSaudeStore.findByUnidadeComAgenda(unidadeLogada.id).then(result => {
            profissionalSaudeStore.profissionaisSaudeUnidade = result.map(profissionalSaude => ({
                ...profissionalSaude,
                name: profissionalSaude.nome,
                value: profissionalSaude.id
            }));
        });
    }

    handleSearchChange = e => {
        const {extratoStore} = this.props;
        const search = e.target.value;
        extratoStore.currentPage = null;
        extratoStore.searchDTO.pageNumber = 0;
        extratoStore.searchDTO.search = search;
        this.debounceConsulta();
    };

    handleDateChange = e => {
        this.setState({filterDateSelected: e}, () => {
            const {extratoStore} = this.props;
            const {filterDateSelected} = this.state;

            if (filterDateSelected instanceof moment) {
                extratoStore.currentPage = null;
                extratoStore.searchDTO.pageNumber = 0;
                extratoStore.searchDTO.dataInicial = filterDateSelected.startOf('month').format('YYYY-MM-DD');
                extratoStore.searchDTO.dataFinal = filterDateSelected.endOf('month').format('YYYY-MM-DD');
                extratoStore.findAll();
            }
        });
    };

    handleProfissionalSaudeChange = e => {
        const {extratoStore} = this.props;
        extratoStore.currentPage = null;
        extratoStore.searchDTO.pageNumber = 0;

        this.setState({
            ...this.state,
            profissionalSaude: e
        });

        extratoStore.searchDTO.profissionalSaudeId = e?.value;
        this.debounceConsulta();
    };

    loadMore = () => {
        const {extratoStore} = this.props;

        extratoStore.findAll();
    };

    handleItemClick = id => {
        const {extratoStore} = this.props;

        extratoStore.edit(id);
    };

    handleClickAction = action => {
        const {extratoStore} = this.props;

        extratoStore.openNew(action.tipo);
    };

    render() {
        const {filterDateSelected} = this.state;
        const {classes, extratoStore, profissionalSaudeStore} = this.props;
        const {
            loading,
            tituloList,
            open,
            searchDTO
        } = extratoStore;

        const actions = [
            {
                icon: <RemoveIcon/>,
                name: "Despesa",
                tipo: TituloTipo.DESPESA,
                buttonClasses: classes.buttonAddDespesa
            },
            {
                icon: <AddIcon/>,
                name: "Receita",
                tipo: TituloTipo.RECEITA,
                buttonClasses: classes.buttonAddReceita
            }
        ];

        return (
            <div className={classes.content}>
                <Header padding>
                    <Grid item xs={4}>
                        <h3 className={classes.titleHeader}>Extrato</h3>
                    </Grid>

                    <Grid item xs={8}>
                        <Grid container justify={"space-between"} alignItems={"center"}>
                            <Grid item/>

                            <Grid item>
                                <Profile/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Header>

                <div className={classes.tableContainer}>
                    <div className={classes.search}>
                        <Grid container spacing={8}>
                            <Grid item xs={4} className={classes.spacing}>
                                <InputSearch
                                    onChange={this.handleSearchChange}
                                    value={searchDTO.search}
                                    placeholder="Pesquisar"
                                />
                            </Grid>
                            <Grid item xs={3} className={classes.spacing}>
                                <SelectSearch
                                    className={classes.selectSearch}
                                    name="status"
                                    placeholder="Profissional de saúde"
                                    value={this.state.profissionalSaude}
                                    elements={profissionalSaudeStore.profissionaisSaudeUnidade || []}
                                    onChange={this.handleProfissionalSaudeChange}
                                />
                            </Grid>
                            <Grid item xs={2} className={classes.spacing}>
                                <InputDateForm
                                    variant="outlined"
                                    fullWidth
                                    openTo="month"
                                    views={["year", "month"]}
                                    value={filterDateSelected}
                                    onChange={this.handleDateChange}
                                    format="MM/YYYY"
                                    placeholder={"__/____"}
                                    mask={value => (value ? [/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : [])}
                                />
                            </Grid>
                        </Grid>

                    </div>

                    {!loading && tituloList.length === 0 && (
                        <div className={classes.notFoundContainer}>
                            <h3>Nenhum item encontrado</h3>
                        </div>
                    )}
                    {tituloList.length > 0 && (

                            <RSC style={{width: "99%", height: "90%", marginLeft: 10}}>
                                <Table
                                    className={classes.table}
                                    dados={tituloList}
                                    columns={columns}
                                    clickable={true}
                                    handleClick={this.handleItemClick}
                                />
                            </RSC>

                    )}
                    <SpeedDials
                        actions={actions}
                        onClickAction={this.handleClickAction}
                    />
                </div>
                {open && <ExtratoModal open={open} />}
            </div>
        );
    }
}

export default withStyles(styles)(Extrato);
