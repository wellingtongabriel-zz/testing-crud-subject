import React from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core";
import SelectForm from "../../components/Select/Select";

const styles = () => ({
    formControlSelect: {
        width: 'auto',
        marginRight: 20,
    }
});

@inject('filtroHeaderStore', 'atendimentoStore', 'configuracaoHorarioAtendimentoStore', 'configuracaoImpressaoStore')
@observer
class FiltroHeader extends React.Component {
    state = {
        isMounted: false,
    };
    mounted = false;
    
    async componentDidMount() {
        this.mounted = true;
        const { filtroHeaderStore, screen } = this.props;
        
        await filtroHeaderStore.checkRoles(screen);
        await filtroHeaderStore.changeFiltros({ unidadeId: filtroHeaderStore.unidade, profissionalSaudeId: filtroHeaderStore.profissionalSaude });
        
        if (!this.mounted) {
            return;
        }
        
        this.setState({ isMounted: true });
    }
    
    componentWillUnmount() {
        this.mounted = false;
    }
    
    handleUnidadeChange = async (e) => {
        const {screen, filtroHeaderStore, atendimentoStore, configuracaoHorarioAtendimentoStore, configuracaoImpressaoStore } = this.props;
        filtroHeaderStore.unidade = e.target.value;

        await filtroHeaderStore.changeFiltros({ unidadeId: filtroHeaderStore.unidade }, true);

        if(screen === 'AGENDAMENTO') {
            await atendimentoStore.initObjectView(atendimentoStore.selectedDate);
        }

        if(screen === 'CONFIGURACAO_HORARIO_ATENDIMENTO') {
            configuracaoHorarioAtendimentoStore.resetSearchDTO();
            await configuracaoHorarioAtendimentoStore.findAll({pageNumber: 0});
        }

        if(screen === 'CONFIGURACAO_RECEITA') {
            await configuracaoImpressaoStore.getConfig();
        }
    };
    
    handleProfissionalSaudeChange = (e) => {
        const { screen, atendimentoStore, configuracaoHorarioAtendimentoStore, configuracaoImpressaoStore, filtroHeaderStore } = this.props;
        filtroHeaderStore.profissionalSaude = e.target.value;
        
        if(screen === 'AGENDAMENTO') {
            atendimentoStore.initObjectView(atendimentoStore.selectedDate);
        }
        if(screen === 'CONFIGURACAO_HORARIO_ATENDIMENTO') {
            configuracaoHorarioAtendimentoStore.resetSearchDTO();
            configuracaoHorarioAtendimentoStore.findAll({ pageNumber: 0 });
        }
        if(screen === 'CONFIGURACAO_RECEITA') {
            configuracaoImpressaoStore.getConfig();
        }
    };
    
    render() {
        const { isMounted } = this.state;
        const { classes, filtroHeaderStore } = this.props;
        const { showFiltroProfissionalSaude } = filtroHeaderStore;
        const showFiltroUnidades = filtroHeaderStore.unidades.length > 2;
        
        if (!isMounted) {
            return null;
        }
        
        return (
            <div>
                {
                    showFiltroUnidades && (
                        <SelectForm
                            name="filtro-unidades"
                            onChange={this.handleUnidadeChange}
                            value={filtroHeaderStore.unidade}
                            elements={filtroHeaderStore.unidades}
                            hideBorders
                            selectedItemColor="primary"
                            formControlProps={{
                                className: classes.formControlSelect
                            }}
                        />
                    )
                }
                {
                    showFiltroProfissionalSaude && (
                        <SelectForm
                            name="filtro-profissionais-saude"
                            onChange={this.handleProfissionalSaudeChange}
                            value={filtroHeaderStore.profissionalSaude}
                            elements={filtroHeaderStore.profissionaisSaude}
                            hideBorders
                            selectedItemColor="primary"
                            formControlProps={{
                                className: classes.formControlSelect
                            }}
                        />
                    )
                }
            </div>
        )
    }
}

export default withStyles(styles)(FiltroHeader);
