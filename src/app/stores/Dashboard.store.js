import { observable } from "mobx";
import moment from "moment";
import 'moment/locale/pt-br';
import Api from '../config/api';

export default class DashboardStore {
    @observable valorTotalReceita = 0;
    @observable valorTotalDespesa = 0;
    @observable saldoTotalTituloParcela = 0;
    @observable totalAgendamentos = 0;
    @observable totalAgendamentosDia = 0;
    @observable atendimentosAtrasados = 0;
    @observable porcentagemAtendimentosAtrasados = 0;
    @observable agendaGraphData = [];
    @observable mediaTempoAtendimentoData = [];
    @observable saldoGraphData = [];
    @observable tempoAtendimentoGraphData = [];
    
    async loadDados() {
        try {
            const { data } = await Api.post('',
                {
                    query: `
                    {
                        valorTotalReceita: valorTotalTituloParcela(search: {tituloTipo: RECEITA, dataInicial: "${this.getDataInicioFimMes().inicio}", dataFinal: "${this.getDataInicioFimMes().fim}"})
                        valorTotalDespesa: valorTotalTituloParcela(search: {tituloTipo: DESPESA, dataInicial: "${this.getDataInicioFimMes().inicio}", dataFinal: "${this.getDataInicioFimMes().fim}"})
                        
                        saldoTotalTituloParcela(search: {dataInicial: "${this.getDataInicioFimMes().inicio}", dataFinal: "${this.getDataInicioFimMes().fim}"})
                        saldoTotalTituloParcelaMes1: saldoTotalTituloParcela(search: {dataInicial: "${this.getDataInicioFimMes(5).inicio}", dataFinal: "${this.getDataInicioFimMes(5).fim}"})
                        saldoTotalTituloParcelaMes2: saldoTotalTituloParcela(search: {dataInicial: "${this.getDataInicioFimMes(4).inicio}", dataFinal: "${this.getDataInicioFimMes(4).fim}"})
                        saldoTotalTituloParcelaMes3: saldoTotalTituloParcela(search: {dataInicial: "${this.getDataInicioFimMes(3).inicio}", dataFinal: "${this.getDataInicioFimMes(3).fim}"})
                        saldoTotalTituloParcelaMes4: saldoTotalTituloParcela(search: {dataInicial: "${this.getDataInicioFimMes(2).inicio}", dataFinal: "${this.getDataInicioFimMes(2).fim}"})
                        saldoTotalTituloParcelaMes5: saldoTotalTituloParcela(search: {dataInicial: "${this.getDataInicioFimMes(1).inicio}", dataFinal: "${this.getDataInicioFimMes(1).fim}"})
                        
                        mediaTempoAtendimentoMes1: mediaTempoAtendimento(search: {dataInicial: "${this.getDataInicioFimMes(5).inicio}", dataFinal: "${this.getDataInicioFimMes(5).fim}"})
                        mediaTempoAtendimentoMes2: mediaTempoAtendimento(search: {dataInicial: "${this.getDataInicioFimMes(4).inicio}", dataFinal: "${this.getDataInicioFimMes(4).fim}"})
                        mediaTempoAtendimentoMes3: mediaTempoAtendimento(search: {dataInicial: "${this.getDataInicioFimMes(3).inicio}", dataFinal: "${this.getDataInicioFimMes(3).fim}"})
                        mediaTempoAtendimentoMes4: mediaTempoAtendimento(search: {dataInicial: "${this.getDataInicioFimMes(2).inicio}", dataFinal: "${this.getDataInicioFimMes(2).fim}"})
                        mediaTempoAtendimentoMes5: mediaTempoAtendimento(search: {dataInicial: "${this.getDataInicioFimMes(1).inicio}", dataFinal: "${this.getDataInicioFimMes(1).fim}"})
                        mediaTempoAtendimentoMes6: mediaTempoAtendimento(search: {dataInicial: "${this.getDataInicioFimMes().inicio}", dataFinal: "${this.getDataInicioFimMes().fim}"})
                        
                        tempoAtendimentoMes1: tempoAtendimento(search: {dataInicial: "${this.getDataInicioFimMes(5).inicio}", dataFinal: "${this.getDataInicioFimMes(5).fim}"})
                        tempoAtendimentoMes2: tempoAtendimento(search: {dataInicial: "${this.getDataInicioFimMes(4).inicio}", dataFinal: "${this.getDataInicioFimMes(4).fim}"})
                        tempoAtendimentoMes3: tempoAtendimento(search: {dataInicial: "${this.getDataInicioFimMes(3).inicio}", dataFinal: "${this.getDataInicioFimMes(3).fim}"})
                        tempoAtendimentoMes4: tempoAtendimento(search: {dataInicial: "${this.getDataInicioFimMes(2).inicio}", dataFinal: "${this.getDataInicioFimMes(2).fim}"})
                        tempoAtendimentoMes5: tempoAtendimento(search: {dataInicial: "${this.getDataInicioFimMes(1).inicio}", dataFinal: "${this.getDataInicioFimMes(1).fim}"})
                        tempoAtendimentoMes6: tempoAtendimento(search: {dataInicial: "${this.getDataInicioFimMes().inicio}", dataFinal: "${this.getDataInicioFimMes().fim}"})
                        
                        totalAgendamentos(search: {dataInicial: "${this.getDataInicioFimMes().inicio}", dataFinal: "${this.getDataInicioFimMes().fim}"})
                        totalAgendamentosAgendados: totalAgendamentos(search: {situacoes: [AGENDADO, CONFIRMADO, AGUARDANDO, ATENDENDO], dataInicial: "${this.getDataInicioFimMes().inicio}", dataFinal: "${this.getDataInicioFimMes().fim}"})
                        totalAgendamentosDia(search: {dataInicial: "${this.getHoje()}"})
                        totalAgendamentosAtendidos: totalAgendamentos(search: {situacoes: ATENDIDO, dataInicial: "${this.getDataInicioFimMes().inicio}", dataFinal: "${this.getDataInicioFimMes().fim}"})
                        
                        atendimentosAtrasados(search: {dataInicial: "${this.getDataInicioFimMes().inicio}", dataFinal: "${this.getDataInicioFimMes().fim}"})
                    }
                        `
                }
            );
            
            if(data.errors) {
                throw data.errors[0];
            }
            
            this.valorTotalReceita = data.data.valorTotalReceita;
            this.valorTotalDespesa = data.data.valorTotalDespesa;
            this.saldoTotalTituloParcela = data.data.saldoTotalTituloParcela;
            this.totalAgendamentos = data.data.totalAgendamentos;
            this.totalAgendamentosDia = data.data.totalAgendamentosDia;
            this.atendimentosAtrasados = data.data.atendimentosAtrasados;
            this.porcentagemAtendimentosAtrasados = this.totalAgendamentos ? this.atendimentosAtrasados / this.totalAgendamentos * 100 : 0;
            
            this.getSaldoGraphData({
                mes1: data.data.saldoTotalTituloParcelaMes1,
                mes2: data.data.saldoTotalTituloParcelaMes2,
                mes3: data.data.saldoTotalTituloParcelaMes3,
                mes4: data.data.saldoTotalTituloParcelaMes4,
                mes5: data.data.saldoTotalTituloParcelaMes5,
                mes6: data.data.saldoTotalTituloParcela,
            });
            
            this.getMediaTempoAtendimentoData({
                mes1: data.data.mediaTempoAtendimentoMes1,
                mes2: data.data.mediaTempoAtendimentoMes2,
                mes3: data.data.mediaTempoAtendimentoMes3,
                mes4: data.data.mediaTempoAtendimentoMes4,
                mes5: data.data.mediaTempoAtendimentoMes5,
                mes6: data.data.mediaTempoAtendimentoMes6,
            });
            
            this.getTempoAtendimentoGraphData({
                mes1: data.data.tempoAtendimentoMes1,
                mes2: data.data.tempoAtendimentoMes2,
                mes3: data.data.tempoAtendimentoMes3,
                mes4: data.data.tempoAtendimentoMes4,
                mes5: data.data.tempoAtendimentoMes5,
                mes6: data.data.tempoAtendimentoMes6,
            });
            
            this.getAgendaGraphData({
                agendados: data.data.totalAgendamentosAgendados,
                atendidos: data.data.totalAgendamentosAtendidos,
                total: data.data.totalAgendamentos,
            });
            
            return data.data;
        } catch (error) {
            throw error;
        }
    }
    
    getDataInicioFimMes(subtract = 0) {
        return {
            inicio: moment().startOf('month').subtract(subtract, 'month').format('YYYY-MM-DD'),
            fim: moment().endOf('month').subtract(subtract, 'month').format('YYYY-MM-DD'),
        }
    }
    
    getMes(subtract = 0) {
        return moment().startOf('month').subtract(subtract, 'month').format('MMMM')
    }
    
    getAgendaGraphData(data) {
        this.totalAgendamentos = data.total || 0;
        this.agendaGraphData = [
            { label: 'Pacientes agendados', value: data.agendados || 0, color: "#0093bd" },
            { label: 'Pacientes atendidos', value: data.atendidos || 0, color: "#52d5fc" },
        ];
    }
    
    getMediaTempoAtendimentoData(data) {
        this.mediaTempoAtendimentoData = this.getDefaultBarAreaChartData(data).map(item => ({
            ...item,
            max: parseFloat(item.max / 60).toFixed(0), //converte em minutos
            value: parseFloat(item.value / 60).toFixed(0) //converte em minutos
        }));
    }
    
    getSaldoGraphData(data) {
        this.saldoGraphData = this.getDefaultBarAreaChartData(data);
    }
    
    getTempoAtendimentoGraphData(data) {
        this.tempoAtendimentoGraphData = this.getDefaultBarAreaChartData(data).map(item => ({
            ...item,
            max: parseFloat(item.max / 3600).toFixed(0), //converte em minutos
            value: parseFloat(item.value / 3600).toFixed(0) //converte em horas
        }));
    }
    
    getDefaultBarAreaChartData(data) {
        const max = Math.max(...Object.values(data));
        const min = Math.min(...Object.values(data));
        
        return [
            { label: this.getMes(5), max, min, value: data.mes1 || 0 },
            { label: this.getMes(4), max, min, value: data.mes2 || 0 },
            { label: this.getMes(3), max, min, value: data.mes3 || 0 },
            { label: this.getMes(2), max, min, value: data.mes4 || 0 },
            { label: this.getMes(1), max, min, value: data.mes5 || 0 },
            { label: this.getMes(), max, min, value: data.mes6 || 0 },
        ];
    }

    getHoje(){
        return moment().format("YYYY-MM-DD")
    }
}
