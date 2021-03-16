import {action, observable} from 'mobx';
import Moment from "moment";
import Api from '../config/api';
import string from "../utils/string";
import {Dates} from "../utils";
import {createMutation} from "../pages/Querys";
import localStorageService, {ACCESS_TOKEN_KEY, CONVENIOS_KEY} from '../services/storage';
import {findConveniosByAtivo} from '../services/ConvenioService';
import {buildUrlFotoPerfil, db} from '../config/config';

const situacoesDefault = [
    {value: 'AGENDADO', name: "Agendado", cor: "blue"},
    {value: 'CONFIRMADO', name: "Confirmado", cor: "green"},
    {value: 'AGUARDANDO', name: "Aguardando", cor: "yellow"},
    {value: 'ATENDENDO', name: "Atendendo", cor: "waikawaGrey"},
    {value: 'ATENDIDO', name: "Atendido", cor: "purple"},
    {value: 'BLOQUEADO', name: "Bloqueado", cor: "darkGray"},
];

const tiposConsultaDefault = [
    {value: 'PRESENCIAL', name: "Presencial"},
    {value: 'REMOTA', name: "Remota"}
];

const sujeitoAtencaoPageableDefault = {
    pageNumber: 0,
    pageSize: 10,
    sortDir: 'ASC',
    sortField: 'nome'
};

class AtendimentoStore {
    prontuarioStore = null;
    filtroHeaderStore = null;
    @observable accessToken = null;
    @observable sujeitosAtencao = [];
    @observable sujeitosAtencaoLastContent = false;
    @observable sujeitosAtencaoLoading = false;
    @observable sujeitosAtencaoCurrentPage = 0;
    @observable convenios = [{value: '', name: ''}];
    @observable open = false;
    @observable enableCadastrarNovo = false;
    @observable idOpened;
    @observable timeRange;
    @observable eventos = [];
    @observable eventosFiltrados = [];
    @observable configVigente = null;
    @observable calendarConfig = {};
    @observable selectedDate = Moment();
    @observable status = [];
    @observable periodosAtendimento = [];
    @observable agPadrao = {};
    @observable loadingCalendar = true;
    @observable calendarErrorMessage = null;
    @observable cancelandoAgendamento = false;
    @observable disableModalButtons = false;
    @observable isProntuarioPage = false;
    @observable typeCalendarViewSelected = 'dayView';

    @observable cancelarAgendamentoAlertData = {
        agendamento: null,
        openAlert: false,
        title: '',
        description: ''
    };

    @observable objView = {
        cpf: '',
        dataNascimento: '',
        id: '',
        sujeitoId: '',
        nome: '',
        situacao: '',
        telefone: '',
        tipo: '',
        convenio: {id: ''},
        tipoConsulta: '',
        observacao: '',
        data: '',
        horaInicio: '',
        horaFim: '',
        duracao: 0
    };

    @observable errors = {
        cpf: false,
        nome: false,
        telefone: false
    };

    @observable duracoesDisponives = [];

    @observable situacoes = situacoesDefault;

    @observable filtroSituacoes = situacoesDefault.filter(s => s.value !== 'BLOQUEADO');

    @observable situacoesAlteracaoStatus = situacoesDefault.filter(s => {
        return s.value === 'AGENDADO' || s.value === 'CONFIRMADO' || s.value === 'AGUARDANDO';
    });

    tipos = [
        {value: 'CONSULTA', name: "Consulta"},
        {value: 'RETORNO', name: "Retorno"}
    ];

    @observable tiposConsulta = tiposConsultaDefault;

    agendamentoPadrao() {
        Api.post('',
            {
                query: `{
                  agendamentoPadrao {
                    tipo
                    situacao
                    cpf
                    convenio{
                        id
                        descricao
                    }
                    data
                    dataNascimento
                    horaFim
                    horaInicio
                    nome
                  }
                }`
            }).then((result) => {
            this.agPadrao = result.data.data.agendamentoPadrao;
        }).catch((error) => console.error(error));
    }

    @action changeOpen(id, date, dateEnd, status) {
        if (!date) return;
        this.idOpened = id;
        this.enableCadastrarNovo = !id;
        this.objView = {...this.objView, ...this.agPadrao};
        this.objView.data = Moment(date);
        this.objView.situacao = status || this.agPadrao.situacao;
        this.objView.dataNascimento = this.objView.dataNascimento || '';
        this.objView.convenio = this.objView.convenio || {id: ''};
        this.objView.horaInicio = Moment(date).format('HH:mm');
        this.objView.horaFim = Moment(dateEnd).format('HH:mm');
        this.objView.duracao = Moment(dateEnd).diff(date, 'minute');

        this.sujeitosAtencaoLastContent = false;

        if (id) {
            this.loadAgendamento(id);
        }
        this.open = true;
    }

    @action
    async initObjectView(date = Moment(), loadingCalendar = true) {
        this.accessToken = await localStorage.getItem(ACCESS_TOKEN_KEY);

        switch (this.typeCalendarViewSelected) {
            case 'dayView':
                this.initObjectDayView(date = Moment(), loadingCalendar = true);
                break;
            default:
                this.initObjectWeekView(date = Moment(), loadingCalendar = true);
                break;
        }
    }

    async initObjectWeekView(date = Moment(), loadingCalendar = true) {
        try {
            this.loadingCalendar = loadingCalendar;
            this.calendarErrorMessage = null;
            const {unidadeId, profissionalSaudeId} = await this.filtroHeaderStore.getFiltroAtual();
            const {showFiltroProfissionalSaude} = await this.filtroHeaderStore.checkRoles('AGENDAMENTO');

            if (profissionalSaudeId === 0 && showFiltroProfissionalSaude) {
                throw new Error('É necessário selecionar um profissional de saúde.');
            }

            let metodoConfiguracaoVigente = 'configuracaoHorarioAtendimentoVigente';
            if (profissionalSaudeId && showFiltroProfissionalSaude) {
                metodoConfiguracaoVigente = 'configuracaoHorarioAtendimentoVigenteOutrosProfissionaisSaude';
            }

            const result = await Api.post('', {
                query:
                    `
                    fragment dadosDia on HorarioAtendimento {
                      horaInicio
                      horaFim
                      permiteAgendamento
                    }
                    fragment dias on ConfiguracaoHorarioAtendimento {
                        domingo {
                          ...dadosDia
                        }
                        segunda: segundaFeira {
                          ...dadosDia
                        }
                        terca: tercaFeira {
                          ...dadosDia
                        }
                        quarta: quartaFeira {
                          ...dadosDia
                        }
                        quinta: quintaFeira {
                          ...dadosDia
                        }
                        sexta: sextaFeira {
                          ...dadosDia
                        }
                        sabado {
                          ...dadosDia
                        }
                    }
                    query($filter: SearchDTOInput){
                        configuracaoHorarioAtendimentoVigente: ${metodoConfiguracaoVigente}(searchDTO: $filter) {
                            id
                            horaInicioPeriodoAtendimento
                            horaFimPeriodoAtendimento
                            duracao
                            ...dias
                        }
                    }`,
                variables: {
                    filter: {
                        dataInicial: date.days(0).format('YYYY-MM-DD'),
                        dataFinal: date.days(6).format('YYYY-MM-DD'),
                        unidadeId,
                        profissionalSaudeId
                    }
                }
            });

            const {configuracaoHorarioAtendimentoVigente} = result.data.data;

            const config = configuracaoHorarioAtendimentoVigente ? configuracaoHorarioAtendimentoVigente[0] : null;

            if (!config) {
                if (profissionalSaudeId === 0 && showFiltroProfissionalSaude) {
                    throw new Error('É necessário selecionar um profissional de saúde.');
                } else {
                    throw new Error('O Horário do Atendimento não foi configurado.');
                }
            }

            this.configVigente = config;
            this.periodosAtendimento = config.periodosAtendimento;
            let horaInicioPeriodoAtendimento = config.horaInicioPeriodoAtendimento;
            let horaFimPeriodoAtendimento = config.horaFimPeriodoAtendimento;
            let duracao = config.duracao;

            this.objView.duracao = duracao;
            let opcoesDeDuracao = [1, 2, 3, 4, 5, 6, 7, 8];
            this.duracoesDisponives = opcoesDeDuracao.map(element => {
                let value = element * duracao;
                return {name: value + ' min.', value: value}
            });

            this.calendarConfig = {
                min: Moment(horaInicioPeriodoAtendimento, 'HH:mm').day(0).toDate(),
                max: Moment(horaFimPeriodoAtendimento, 'HH:mm').add(duracao, 'minutes').day(6).toDate(),
                duracao: duracao
            };

            this.atualizaAgendamentos(this.selectedDate);

        } catch (error) {
            this.calendarErrorMessage = error.message;
        } finally {
            this.loadingCalendar = false;
        }
    }

    async initObjectDayView(date = Moment(), loadingCalendar = true) {
        try {
            this.loadingCalendar = loadingCalendar;
            this.calendarErrorMessage = null;
            const {unidadeId, profissionalSaudeId} = await this.filtroHeaderStore.getFiltroAtual();
            const {showFiltroProfissionalSaude} = await this.filtroHeaderStore.checkRoles('AGENDAMENTO');

            if (profissionalSaudeId === 0 && showFiltroProfissionalSaude) {
                throw new Error('É necessário selecionar um profissional de saúde.');
            }

            let metodoConfiguracaoVigente = 'configuracaoHorarioAtendimentoVigente';
            if (profissionalSaudeId && showFiltroProfissionalSaude) {
                metodoConfiguracaoVigente = 'configuracaoHorarioAtendimentoVigenteOutrosProfissionaisSaude';
            }

            const result = await Api.post('', {
                query:
                    `
                    fragment dadosDia on HorarioAtendimento {
                      horaInicio
                      horaFim
                      permiteAgendamento
                    }
                    fragment dias on ConfiguracaoHorarioAtendimento {
                        domingo {
                          ...dadosDia
                        }
                        segunda: segundaFeira {
                          ...dadosDia
                        }
                        terca: tercaFeira {
                          ...dadosDia
                        }
                        quarta: quartaFeira {
                          ...dadosDia
                        }
                        quinta: quintaFeira {
                          ...dadosDia
                        }
                        sexta: sextaFeira {
                          ...dadosDia
                        }
                        sabado {
                          ...dadosDia
                        }
                    }
                    query($filter: SearchDTOInput){
                        configuracaoHorarioAtendimentoVigente: ${metodoConfiguracaoVigente}(searchDTO: $filter) {
                            id
                            horaInicioPeriodoAtendimento
                            horaFimPeriodoAtendimento
                            duracao
                            ...dias
                        }
                    }`,
                variables: {
                    filter: {
                        dataInicial: date.format('YYYY-MM-DD'),
                        dataFinal: date.format('YYYY-MM-DD'),
                        unidadeId,
                        profissionalSaudeId
                    }
                }
            });

            const {configuracaoHorarioAtendimentoVigente} = result.data.data;

            const config = configuracaoHorarioAtendimentoVigente ? configuracaoHorarioAtendimentoVigente[0] : null;

            if (!config) {
                if (profissionalSaudeId === 0 && showFiltroProfissionalSaude) {
                    throw new Error('É necessário selecionar um profissional de saúde.');
                } else {
                    throw new Error('O Horário do Atendimento não foi configurado.');
                }
            }

            this.configVigente = config;
            this.periodosAtendimento = config.periodosAtendimento;
            let horaInicioPeriodoAtendimento = config.horaInicioPeriodoAtendimento;
            let horaFimPeriodoAtendimento = config.horaFimPeriodoAtendimento;
            let duracao = config.duracao;

            this.objView.duracao = duracao;

            let opcoesDeDuracao = [];

            for(let x = 1; x <= (360 / duracao); x++){
                opcoesDeDuracao.push(x);
            }

            this.duracoesDisponives = opcoesDeDuracao.map(element => {
                let value = element * duracao;
                return {name: value + ' min.', value: value}
            });

            this.calendarConfig = {
                min: Moment(horaInicioPeriodoAtendimento, 'HH:mm').toDate(),
                max: Moment(horaFimPeriodoAtendimento, 'HH:mm').add(duracao, 'minutes').toDate(),
                duracao: duracao
            };

            this.atualizaAgendamentos(this.selectedDate);

        } catch (error) {
            this.calendarErrorMessage = error.message;
            console.log(error);
        } finally {
            this.loadingCalendar = false;
        }
    }

    @action
    async atualizaAgendamentos(date = Moment()) {
        switch (this.typeCalendarViewSelected) {
            case 'dayView':
                this.atualizaAgendamentosDay(date);
                break;
            default:
                this.atualizaAgendamentosWeek(date);
                break;
        }
    }

    async atualizaAgendamentosWeek(date = Moment()) {
        const {unidadeId, profissionalSaudeId} = await this.filtroHeaderStore.getFiltroAtual();
        const {showFiltroProfissionalSaude} = await this.filtroHeaderStore.checkRoles('AGENDAMENTO');

        let metodoAgendamento = 'findAllAgendamento';
        if (profissionalSaudeId && showFiltroProfissionalSaude) {
            metodoAgendamento = 'findAllAgendamentoOutrosProfissionaisSaude';
        }

        const result = await Api.post('', {
            query:
                `   query($filterAgendamento: SearchAgendamentoDTOInput){
                        agendamentos: ${metodoAgendamento}(searchDTO: $filterAgendamento) {
                            content {
                              id
                              nome
                              cpf
                              dataNascimento
                              data
                              telefone  
                              situacao
                              horaFim
                              horaInicio
                            }
                        }
                    }`,
            variables: {
                filterAgendamento: {
                    dataInicial: date.days(0).format('YYYY-MM-DD'),
                    dataFinal: date.days(6).format('YYYY-MM-DD'),
                    unidadeId,
                    profissionalSaudeId,
                    pageSize: 2000,
                    pageNumber: 0
                }
            }
        });

        const {agendamentos} = result.data.data;
        if(agendamentos) {
            this.eventos = agendamentos.content.map(value => {
                    const min = Moment(this.calendarConfig.min).format('HH:mm');
                    if (Moment(value.horaInicio, 'HH:mm').isBefore(Moment(min, 'HH:mm'))) {
                        return null;
                    }
                    const max = Moment(this.calendarConfig.max).format('HH:mm');
                    if (Moment(value.horaFim, 'HH:mm').isAfter(Moment(max, 'HH:mm'))) {
                        return null;
                    }
                    return {
                        id: value.id,
                        nome: value.nome,
                        status: value.situacao,
                        telefone: value.telefone,
                        start: Moment(`${value.data} ${value.horaInicio}`, 'YYYY-MM-DD HH:mm'),
                        end: Moment(`${value.data} ${value.horaFim}`, 'YYYY-MM-DD HH:mm'),
                        permiteAgendamento: true
                    }
                }
            ).filter(Boolean);
        }

        if (this.configVigente)
            this.eventos.push(...this.filterAgendamentos(this.configVigente));

        this.filterEvents();
    }

    async atualizaAgendamentosDay(date = Moment()) {
        const {unidadeId, profissionalSaudeId} = await this.filtroHeaderStore.getFiltroAtual();
        const {showFiltroProfissionalSaude} = await this.filtroHeaderStore.checkRoles('AGENDAMENTO');

        let metodoAgendamento = 'findAllAgendamento';
        if (profissionalSaudeId && showFiltroProfissionalSaude) {
            metodoAgendamento = 'findAllAgendamentoOutrosProfissionaisSaude';
        }

        const result = await Api.post('', {
            query:
                `   query($filterAgendamento: SearchAgendamentoDTOInput){
                        agendamentos: ${metodoAgendamento}(searchDTO: $filterAgendamento) {
                            content {
                              id
                              nome
                              cpf
                              dataNascimento
                              data
                              telefone  
                              situacao
                              horaFim
                              horaInicio
                              tipo
                              convenio {
                                  descricao
                              }
                              sujeitoAtencao {
                                  dataNascimento,
                                  fotoPerfil
                              }
                            }
                        }
                    }`,
            variables: {
                filterAgendamento: {
                    dataInicial: date.format('YYYY-MM-DD'),
                    dataFinal: date.format('YYYY-MM-DD'),
                    unidadeId,
                    profissionalSaudeId,
                    pageSize: 2000,
                    pageNumber: 0
                }
            }
        });

        const {agendamentos} = result.data.data;
        this.eventos = agendamentos.content.map(value => {
                const min = Moment(this.calendarConfig.min).format('HH:mm');
                if (Moment(value.horaInicio, 'HH:mm').isBefore(Moment(min, 'HH:mm'))) {
                    return null;
                }
                const max = Moment(this.calendarConfig.max).format('HH:mm');
                if (Moment(value.horaFim, 'HH:mm').isAfter(Moment(max, 'HH:mm'))) {
                    return null;
                }

                return {
                    id: value.id,
                    nome: value.nome,
                    status: value.situacao,
                    telefone: value.telefone,
                    start: Moment(`${value.data} ${value.horaInicio}`, 'YYYY-MM-DD HH:mm'),
                    end: Moment(`${value.data} ${value.horaFim}`, 'YYYY-MM-DD HH:mm'),
                    permiteAgendamento: true,
                    convenio: value.convenio?.descricao,
                    tipo: string.capitalize(value.tipo),
                    idade: value.sujeitoAtencao?.dataNascimento ? Dates.calculaIdade(value.sujeitoAtencao?.dataNascimento) : '',
                    fotoPerfil: value.sujeitoAtencao?.fotoPerfil ? buildUrlFotoPerfil(value.sujeitoAtencao?.fotoPerfil, this.accessToken) : null
                }
            }
        ).filter(Boolean);

        if (this.configVigente)
            this.eventos.push(...this.filterAgendamentosDay(this.configVigente));

        this.filterEvents();
    }

    @action openCancelarAgendamentoAlert(agendamento) {
        console.log('agendamento', agendamento);
        const situacao = agendamento.situacao || agendamento.status;
        const dia = agendamento.start ? Moment(agendamento.start).format('DD/MM/YYYY') : Moment(agendamento.data).format('DD/MM/YYYY');
        const horaInicio = agendamento.start ? Moment(agendamento.start).format('HH:mm') : agendamento.horaInicio;
        const horaFim = agendamento.end ? Moment(agendamento.end).format('HH:mm') : agendamento.horaFim;
        const titleMessage = situacao === 'BLOQUEADO' ? `Deseja cancelar o bloqueio?` : `Deseja cancelar a consulta de ${agendamento?.nome?.trim()}?`;

        this.cancelarAgendamentoAlertData = {
            ...this.cancelarAgendamentoAlertData,
            agendamento,
            openAlert: true,
            title: titleMessage,
            description: `${dia} ${horaInicio} - ${horaFim}`,
        }
    }

    @action closeCancelarAgendamentoAlert() {
        this.cancelarAgendamentoAlertData = {
            ...this.cancelarAgendamentoAlertData,
            agendamento: null,
            openAlert: false,
        }
    }

    @action
    async cancelarAgendamento({id}) {
        try {
            this.disableModalButtons = true;
            this.cancelandoAgendamento = true;
            await Api.post('', {
                query:
                    `
                    mutation($id: Long){
                        cancelarAgendamento(id: $id) {
                            id
                        }
                    }`,
                variables: {
                    id
                }
            });
            await db.remove("prontuarioAgendamentoSelecionado");
            //await this.initObjectView(this.selectedDate, false);
            this.atualizaAgendamentos(this.selectedDate);
            this.disableModalButtons = false;
            this.cancelandoAgendamento = false;
            this.onExit();
        } catch (error) {
            this.disableModalButtons = false;
            this.cancelandoAgendamento = false;
            console.error(error);
        }
    }

    @action
    async updateSituacaoAgendamento({id, situacao}) {
        try {
            await Api.post('', {
                query:
                    `
                    mutation($situacao: AgendamentoSituacao, $id: Long){
                        updateAgendamentoSituacao(situacao: $situacao, id: $id) {
                            id
                        }
                    }`,
                variables: {
                    situacao,
                    id
                }
            });

            //await this.initObjectView(this.selectedDate, false);
            this.atualizaAgendamentos(this.selectedDate);
        } catch (error) {
            console.error(error);
        }
    }

    filterAgendamentos(config) {
        let days = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
        let horarios = [];
        days.forEach((day, index) => {
            if (!config[day])
                return []

            horarios.push(...config[day].map((diaSemana) => {

                let min = Moment(this.calendarConfig.min).format('HH:mm');
                if (Moment(diaSemana.horaInicio, 'HH:mm').isBefore(Moment(min, 'HH:mm'))) {
                    this.calendarConfig.min = Moment(diaSemana.horaInicio, 'HH:mm').day(0).toDate();
                }
                let max = Moment(this.calendarConfig.max).format('HH:mm');
                if (Moment(diaSemana.horaFim, 'HH:mm').isAfter(Moment(max, 'HH:mm'))) {
                    this.calendarConfig.max = Moment(diaSemana.horaFim, 'HH:mm').day(6).toDate();
                }
                if (!diaSemana.permiteAgendamento) {
                    return {
                        permiteAgendamento: diaSemana.permiteAgendamento,
                        start: Moment(`${this.selectedDate.day(index).format('YYYY-MM-DD')} ${diaSemana.horaInicio}`, 'YYYY-MM-DD HH:mm').toDate(),
                        end: Moment(`${this.selectedDate.day(index).format('YYYY-MM-DD')} ${diaSemana.horaFim}`, 'YYYY-MM-DD HH:mm').toDate(),
                        status: 'BLOQUEADO'
                    };
                }

                return null;
            }).filter(value => value))
        });
        return horarios;
    }

    filterAgendamentosDay(config) {
        const daysOfWeek = Dates.daysOfWeekTransform();
        const days = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
        const selectedDay = daysOfWeek[this.selectedDate.format('dddd')];

        let daysConfigure = [];
        for (let i = 0; i < days.length; i++) {
            daysConfigure.push(days[i]);
            if (days[i] === selectedDay)
                break;
        }

        let horarios = [];
        daysConfigure.forEach((day, index) => {
            if (!config[day])
                return [];
            horarios.push(...config[day].map((diaSemana) => {

                let min = Moment(this.calendarConfig.min).format('HH:mm');
                if (Moment(diaSemana.horaInicio, 'HH:mm').isBefore(Moment(min, 'HH:mm'))) {
                    this.calendarConfig.min = Moment(diaSemana.horaInicio, 'HH:mm');
                }
                let max = Moment(this.calendarConfig.max).format('HH:mm');
                if (Moment(diaSemana.horaFim, 'HH:mm').isAfter(Moment(max, 'HH:mm'))) {
                    this.calendarConfig.max = Moment(diaSemana.horaFim, 'HH:mm');
                }
                if (!diaSemana.permiteAgendamento) {
                    return {
                        permiteAgendamento: diaSemana.permiteAgendamento,
                        start: Moment(`${this.selectedDate.day(index).format('YYYY-MM-DD')} ${diaSemana.horaInicio}`, 'YYYY-MM-DD HH:mm'),
                        end: Moment(`${this.selectedDate.day(index).format('YYYY-MM-DD')} ${diaSemana.horaFim}`, 'YYYY-MM-DD HH:mm'),
                        status: 'BLOQUEADO'
                    };
                }

                return null;
            }).filter(value => value))
        });
        return horarios;
    }

    @action
    async loadConvenios() {
        const {unidadeId} = await this.filtroHeaderStore.getFiltroAtual();

        findConveniosByAtivo(unidadeId)
            .then(({data: response}) => {
                if (response.data) {
                    const convenios = response.data.convenios.map(convenio => ({
                        ...convenio,
                        name: convenio.descricao,
                        value: convenio.id
                    }));
                    this.convenios = convenios;
                    if (convenios.length > 0) {
                        localStorageService.set(CONVENIOS_KEY, convenios);
                    }
                }
            })
            .catch((error) => console.error(error));
    }

    @action loadAgendamento(id, cb = () => {}) {
        this.disableModalButtons = true;
        Api.post('',
            {
                query: `
                        {content: findByIdAgendamento(id: ${id}) { id data situacao tipo nome telefone cpf dataNascimento observacao sujeitoAtencao { id } convenio { id descricao } horaInicio horaFim 
                        sujeitoAtencao { id nome cpf dataNascimento fotoPerfil contato { telefonePrincipal } }}}
                    `
            }
        ).then((result) => {
            let entidade = result.data.data.content;
            this.objView = entidade;
            this.objView.sujeitoAtencao = entidade.sujeitoAtencao;
            this.objView.duracao = Moment(entidade.horaFim, 'HH:mm').diff(Moment(entidade.horaInicio, 'HH:mm'), 'minute');
            this.objView.fotoPerfil = entidade.sujeitoAtencao?.fotoPerfil ? buildUrlFotoPerfil(entidade.sujeitoAtencao?.fotoPerfil, this.accessToken) : null;

            this.objView.convenio = entidade.convenio;
            if (entidade.convenio) {
                const jaExiste = this.convenios.some(convenio => convenio.id === entidade.convenio.id);
                if (!jaExiste) {
                    this.convenios = [
                        ...this.convenios,
                        {
                            ...entidade.convenio,
                            name: entidade.convenio.descricao,
                            value: entidade.convenio.id,
                            inativo: true
                        }
                    ];
                }
            } else {
                this.convenios = this.convenios.filter(convenio => !convenio.inativo);
            }

            let sujeitos = entidade.sujeitosAtencao;
            this.sujeitosAtencao = !sujeitos ? [] : sujeitos.map(p => {
                p.idade = p.dataNascimento ? Moment().diff(p.dataNascimento, 'years') : '?';
                return p;
            });

            this.enableCadastrarNovo = !(this.objView.sujeitoAtencao && this.objView.sujeitoAtencao.id);
            this.disableModalButtons = false;

            return cb(this.objView);
        });
    }

    @action
    async loadSujeitosAtencao(pageable = {...sujeitoAtencaoPageableDefault}) {
        try {
            this.sujeitosAtencaoLoading = true;

            if (pageable.pageNumber === 0) {
                this.sujeitosAtencaoCurrentPage = 0;
            }

            const {unidadeId, profissionalSaudeId} = await this.filtroHeaderStore.getFiltroAtual();

            let agendamento = {
                unidade: {id: unidadeId},
                profissionalSaude: {id: profissionalSaudeId}
            };
            if (this.objView.nome && this.objView.nome.length > 0)
                agendamento.nome = this.objView.nome;

            if (Moment(this.objView.dataNascimento, 'DD/MM/YYYY')?.isValid())
                agendamento.dataNascimento = Moment(this.objView.dataNascimento, 'DD/MM/YYYY').format('YYYY-MM-DD');

            if (this.objView.cpf && this.objView.cpf.length > 0)
                agendamento.cpf = string.removeSpecialChars(this.objView.cpf);

            if (this.objView.telefone && this.objView.telefone.length > 0)
                agendamento.telefone = string.removeSpecialChars(this.objView.telefone);

            const result = await Api.post('',
                JSON.stringify({
                    query: `query ($agendamento: AgendamentoInput, $pageable: PageableDTOInput) {
                        findSujeitoAtencaoByAgendamento(agendamento: $agendamento, pageable: $pageable) {
                            totalElements
                            last
                            content {
                                id
                                nome
                                dataNascimento
                                cpf
                                fotoPerfil
                                contato {
                                    telefonePrincipal
                                }
                                dadosConvenio {
                                    convenio {
                                        id
                                    }
                                }
                            }
                        }
                    }`,
                    variables: {
                        agendamento,
                        pageable: {
                            ...sujeitoAtencaoPageableDefault,
                            ...pageable
                        }
                    }
                })
            );

            const {findSujeitoAtencaoByAgendamento} = result.data.data;
            this.sujeitosAtencaoLastContent = findSujeitoAtencaoByAgendamento.last;

            const list = findSujeitoAtencaoByAgendamento.content.map(pessoa => {
                pessoa.idade = pessoa.dataNascimento ? Moment().diff(pessoa.dataNascimento, 'years') : ' ';
                return pessoa;
            });

            if (pageable.pageNumber > 0) {
                this.sujeitosAtencao = [...this.sujeitosAtencao, ...list];
            } else {
                this.sujeitosAtencao = [...list];
            }

            return this.sujeitosAtencao;
        } catch (error) {
            console.error(error);
        } finally {
            this.sujeitosAtencaoLoading = false;
        }
    }

    @action
    async loadAgendamentoAndCadastrarNovo(id) {
        try {
            this.idOpened = id;
            const result = await Api.post('',
                {
                    query: `
                            {content: findByIdAgendamento(id: ${id}) { id data situacao tipo nome telefone cpf dataNascimento observacao sujeitoAtencao { id } convenio { id } horaInicio horaFim 
                            sujeitoAtencao { id nome cpf dataNascimento fotoPerfil contato { telefonePrincipal } }}}
                        `
                }
            );
            this.objView = {
                ...result.data.data.content
            };

            return this.updateAgendamento('updateAgendamentoAndPersistSujeitoAtencao');
        } catch (error) {
            throw error;
        }
    }

    @action cadastrarNovo() {
        return this.idOpened
            ? this.updateAgendamento('updateAgendamentoAndPersistSujeitoAtencao')
            : this.createAgendamento('createAgendamentoAndPersistSujeitoAtencao');
    }

    @action agendar() {
        return this.idOpened
            ? this.updateAgendamento('updateAgendamento')
            : this.createAgendamento('createAgendamento');
    }

    @action
    async updateAgendamento(apiName) {
        this.disableModalButtons = true;

        if (this.contemErros()) {
            this.disableModalButtons = false;
            return this.errors;
        }

        const {unidadeId, profissionalSaudeId} = await this.filtroHeaderStore.getFiltroAtual();

        if (this.objView.situacao === 'BLOQUEADO') {
            this.objView.nome = '';
            this.objView.observacao = '';
            this.objView.telefone = '';
            this.objView.cpf = '';
            this.objView.convenio = null;
            this.objView.sujeitoAtencao = null;
        }

        let agendamento = {
            id: this.idOpened,
            data: Moment(this.objView.data).format('YYYY-MM-DD'),
            situacao: this.objView.situacao,
            nome: this.objView.nome,
            tipo: this.objView.tipo,
            horaInicio: this.objView.horaInicio,
            horaFim: this.objView.horaFim,
            unidade: {id: unidadeId},
            profissionalSaude: {id: profissionalSaudeId}
        };

        if (this.objView.observacao && this.objView.observacao.length > 0)
            agendamento.observacao = this.objView.observacao;

        if (this.objView.telefone && this.objView.telefone.length > 0)
            agendamento.telefone = string.removeSpecialChars(this.objView.telefone);

        if (this.objView.cpf && this.objView.cpf.length > 0)
            agendamento.cpf = string.removeSpecialChars(this.objView.cpf);
        if (Moment(this.objView.dataNascimento, 'DD/MM/YYYY')?.isValid())
            agendamento.dataNascimento = Moment(this.objView.dataNascimento, 'DD/MM/YYYY').format('YYYY-MM-DD');

        if (this.objView.convenio !== ('' | null))
            agendamento.convenio = this.objView.convenio;

        if (this.objView.sujeitoAtencao && this.objView.sujeitoAtencao.id)
            agendamento.sujeitoAtencao = {
                id: this.objView.sujeitoAtencao.id
            };

        return Api.post('',
            JSON.stringify({
                query: createMutation({
                    name: apiName,
                    objType: 'AgendamentoInput',
                    objName: 'agendamento',
                    attrsReturn: `
                        id
                        sujeitoAtencao {
                            id
                        }
                    `
                }, 'mutation'),
                variables: {agendamento: agendamento}
            })
        ).then((result) => {
            if (result.data.data && result.data.data[apiName]) {
                if (this.isProntuarioPage) {
                    this.onExit();
                    this.prontuarioStore.findAllAgendamento();
                    return result.data.data[apiName];
                }

                //this.initObjectView(this.selectedDate, false);
                this.atualizaAgendamentos(this.selectedDate);
                this.onExit();
                return result.data.data[apiName];
            }
        })
            .finally(() => {
                this.disableModalButtons = false;
            });
    };

    @action
    async createAgendamento(apiName) {
        this.disableModalButtons = true;

        if (this.contemErros()) {
            this.disableModalButtons = false;
            return this.errors;
        }

        const {unidadeId, profissionalSaudeId} = await this.filtroHeaderStore.getFiltroAtual();

        let agendamento = {
            data: Moment(this.objView.data).format('YYYY-MM-DD'),
            horaInicio: this.objView.horaInicio,
            horaFim: this.objView.horaFim,
            situacao: this.objView.situacao,
            nome: this.objView.nome,
            tipo: this.objView.tipo,
            //tipoConsulta: this.objView.tipoConsulta,
            unidade: {id: unidadeId},
            profissionalSaude: {id: profissionalSaudeId}
        };

        if (this.objView.observacao && this.objView.observacao.length > 0)
            agendamento.observacao = this.objView.observacao;

        if (this.objView.telefone && this.objView.telefone.length > 0)
            agendamento.telefone = string.removeSpecialChars(this.objView.telefone);

        if (this.objView.cpf && this.objView.cpf.length > 0)
            agendamento.cpf = string.removeSpecialChars(this.objView.cpf);

        if (Moment(this.objView.dataNascimento)?.isValid())
            agendamento.dataNascimento = Moment(this.objView.dataNascimento).format('YYYY-MM-DD');

        if (this.objView.convenio?.id)
            agendamento.convenio = this.objView.convenio;

        if (this.objView.sujeitoAtencao && this.objView.sujeitoAtencao.id)
            agendamento.sujeitoAtencao = {
                id: this.objView.sujeitoAtencao.id
            };

        return Api.post('',
            JSON.stringify({
                query: createMutation({
                    name: apiName,
                    objType: 'AgendamentoInput',
                    objName: 'agendamento',
                    attrsReturn: `
                        id
                        sujeitoAtencao {
                            id
                        }
                    `
                }, 'mutation'),
                variables: {agendamento: agendamento}
            })).then((result) => {
            if (result.data.data && result.data.data[apiName]) {
                //this.initObjectView(this.selectedDate, false);
                this.atualizaAgendamentos(this.selectedDate);
                this.onExit();
                return result.data.data[apiName];
            }})
            .finally(() => {
                this.disableModalButtons = false;
            });
    }

    contemErros() {
        this.errors = {};

        if (!this.objView.sujeitoAtencao?.id) {
            this.errors.cpf = string.isEmpty(this.objView.cpf) ? false : !string.validaCPF(this.objView.cpf);
            this.errors.nome = string.isEmpty(this.objView.nome);
            this.errors.telefone = !string.validaTelefone(this.objView.telefone);
        }

        if (this.objView.situacao === 'BLOQUEADO') {
            return false;
        }

        return !this.objView.sujeitoAtencao?.id && (this.errors.nome || this.errors.telefone);
    }

    @action filterEvents() {
        this.status = (this.situacoes.filter(value => !value.disabled)).map(({value}) => value);
        this.eventosFiltrados = this.eventos.filter(value => this.status.includes(value.status));
    }

    @action onExit() {
        this.open = false;
        this.sujeitosAtencao = [];
        this.timeRange = null;
        this.isProntuarioPage = false;

        this.objView = {
            cpf: '',
            dataNascimento: '',
            id: '',
            sujeitoId: '',
            nome: '',
            situacao: '',
            telefone: '',
            tipo: '',
            convenio: {id: '', descricao: ''},
            observacao: '',
            data: '',
            horaInicio: '',
            horaFim: ''
        };

        this.errors = {
            cpf: false,
            nome: false,
            telefone: false
        };
    }

    @action eraseSujeitoAtencaoAgendamento() {
        this.objView.cpf = '';
        this.objView.dataNascimento = '';
        this.objView.sujeitoAtencao = null;
        this.objView.sujeitoId = '';
        this.objView.nome = '';
        this.objView.telefone = '';
        this.objView.convenio = null
        this.objView.observacao = '';
    };

    @action selectSujeitoAtencao(sujeitoAtencao) {
        this.objView.sujeitoAtencao = {
            id: sujeitoAtencao.id,
            observacao: sujeitoAtencao.observacao || undefined,
        };
        this.objView.dataNascimento = sujeitoAtencao.dataNascimento || "";
        this.objView.cpf = sujeitoAtencao.cpf || "";
        this.objView.nome = sujeitoAtencao.nome || "";
        this.objView.convenio = sujeitoAtencao.dadosConvenio?.convenio || {id: '', descricao: ''};

        let telefone = string.removeSpecialChars(this.objView.telefone);

        if (telefone == null || telefone.length < 1)
            telefone = sujeitoAtencao?.contato?.telefonePrincipal || "";

        this.objView.telefone = telefone;
        this.objView.fotoPerfil = sujeitoAtencao.fotoPerfil ? buildUrlFotoPerfil(sujeitoAtencao.fotoPerfil, this.accessToken) : null;
    }
}

export default AtendimentoStore;
