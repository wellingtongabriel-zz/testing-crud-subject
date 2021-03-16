import {action, observable} from "mobx";
import BaseStore from "./Base.store";

import {Dates, RemoveAcento} from "../utils";

import Api from "../config/api";
import {createMutation} from "../pages/Querys";

import Moment from "moment";
import {extendMoment} from "moment-range";
import string from "../utils/string";

const moment = extendMoment(Moment);

const defaultSearchDTO = {
    pageNumber: 0,
    pageSize: 20,
    search: ""
};

export default class ConfiguracaoHorarioAtendimentoStore extends BaseStore {
    configDefault = null;

    filtroHeaderStore = null;

    @observable agendaValues = [];
    @observable configuracoes = [];

    @observable loadingConfig = true;
    @observable configErrorMessage = null;
    @observable duracaoError = false;

    @observable totalElements = 0;
    @observable numberOfElements = 0;
    @observable loading = true;
    @observable saving = false;
    @observable horarioAtendimentoList = [];
    @observable searchDTO = {
        ...defaultSearchDTO
    };

    @observable values = {
        id: null,
        duracao: "",
        horaInicioPeriodoAtendimento: null,
        horaFimPeriodoAtendimento: null,
        dataInicioVigencia: null,
        dataFimVigencia: null,
        periodosAtendimento: []
    };

    @action
    unselectAll() {
        window.selectableGroup.clearSelection();
    }

    @action
    setDuracao(duracao) {
        this.values.duracao = parseInt(duracao) || 0;
        this.duracaoError = false;

        this.unselectAll();
        this.setAgenda(this.values);
    }

    @action
    setAgendaValues(agendaValues) {
        this.agendaValues = agendaValues;
    }

    @action
    insertAgendaValues(item) {
        this.agendaValues.push(item);
    }

    @action setId(id) {
        this.values.id = id;
    }

    @action setDataInicioVigencia(dataInicioVigencia) {
        this.values.dataInicioVigencia = dataInicioVigencia;
    }

    @action setDataFimVigencia(dataFimVigencia) {
        this.values.dataFimVigencia = dataFimVigencia;
    }

    @action setHoraInicioPeriodoAtendimento(horaInicioPeriodoAtendimento = 0) {
        this.unselectAll();
        this.values.horaInicioPeriodoAtendimento = horaInicioPeriodoAtendimento;

        this.setAgenda(this.values);
    }

    @action setHoraFimPeriodoAtendimento(horaFimPeriodoAtendimento = 0) {
        this.unselectAll();
        this.values.horaFimPeriodoAtendimento = horaFimPeriodoAtendimento;

        this.setAgenda(this.values);
    }

    @action reset() {
        this.values = {
            id: null,
            duracao: "",
            horaInicioPeriodoAtendimento: null,
            horaFimPeriodoAtendimento: null,
            dataInicioVigencia: null,
            dataFimVigencia: null,
            periodosAtendimento: []
        };
    }

    @action resetSearchDTO() {
        this.searchDTO = {
            ...defaultSearchDTO
        };
        this.currentPage = null;
    }

    @action
    createAgenda() {
        this.agendaValues = [];
        this.reset();

        this.values = {
            ...this.configDefault,
            dataInicioVigencia: moment(),
            periodosAtendimento: []
        };
        const {
            duracao,
            horaInicioPeriodoAtendimento,
            horaFimPeriodoAtendimento
        } = this.values;

        let hoursDay = Dates.getMinutesOfInterval(
            horaInicioPeriodoAtendimento,
            horaFimPeriodoAtendimento,
            duracao
        );

        for (let x = 0; x < 7; x++) {
            let newArray = [];
            hoursDay.map(hour => newArray.push({ ...hour }));

            this.agendaValues.push({
                id: this.getNameWeekDay(moment().day(x)),
                name: moment()
                    .day(x)
                    .format("ddd"),
                values: newArray,
                isNew: true
            });
        }
    }

    @action
    setAgenda(configuracaoVigente) {
        this.agendaValues = [];

        this.values = configuracaoVigente;
        const {
            duracao,
            horaInicioPeriodoAtendimento,
            horaFimPeriodoAtendimento,
            periodosAtendimento
        } = this.values;

        const existsInPeriodos = (weekDay, hour) => {
            return periodosAtendimento.some(periodo => {
                const start = moment(
                    Dates.hourAndMinuteForString(periodo.horaInicio)
                );
                const end = moment(
                    Dates.hourAndMinuteForString(periodo.horaFim)
                );

                return (
                    weekDay === periodo.diaSemana &&
                    Dates.existInRange(start, end, hour.valueDate)
                );
            });
        };

        let hoursDay = Dates.getMinutesOfInterval(
            horaInicioPeriodoAtendimento,
            moment(horaFimPeriodoAtendimento).subtract(duracao, "minutes"),
            duracao
        );

        for (let x = 0; x < 7; x++) {
            let newArray = [];
            hoursDay.map(hour => newArray.push({ ...hour }));
            const weekDay = this.getNameWeekDay(moment().day(x));

            this.agendaValues.push({
                id: weekDay,
                name: moment()
                    .day(x)
                    .format("ddd"),
                values: newArray.map(hour => {
                    return {
                        ...hour,
                        selected: existsInPeriodos(weekDay, hour)
                    };
                }),
                isNew: true
            });
        }
    }

    @action
    createTimesSelecteds() {
        this.values.periodosAtendimento = [];

        let initializateDate = false;
        let previusDate = null;
        let periodo = {
            diaSemana: "",
            horaInicio: null,
            horaFim: null
        };

        this.agendaValues.forEach(weekDay => {
            weekDay.values.forEach(hour => {
                if (!initializateDate && hour.selected) {
                    periodo.horaInicio = hour.value;
                    periodo.diaSemana = weekDay.id;

                    previusDate = hour.value;
                    initializateDate = true;
                } else if (hour.selected) {
                    previusDate = hour.value;
                } else if (initializateDate && !hour.selected) {
                    periodo.horaFim = previusDate;
                    this.values.periodosAtendimento.push(periodo);
                    initializateDate = false;

                    periodo = {
                        diaSemana: "",
                        horaInicio: null,
                        horaFim: null
                    };
                }
            });
        });
    }

    @action
    async findAll(searchDTO = {}) {
        try {
            if (this.currentPage === this.searchDTO.pageNumber) {
                return;
            }

            this.currentPage = this.searchDTO.pageNumber;

            const {
                unidadeId,
                profissionalSaudeId
            } = await this.filtroHeaderStore.getFiltroAtual();

            const {
                showFiltroProfissionalSaude
            } = await this.filtroHeaderStore.checkRoles(
                "CONFIGURACAO_HORARIO_ATENDIMENTO"
            );

            if (profissionalSaudeId === 0 && showFiltroProfissionalSaude) {
                throw new Error(
                    "É necessário selecionar um profissional de saúde."
                );
            }

            let metodoFindAllConfiguracaoVigente = "findAllConfiguracaoHorarioAtendimento";
            if (profissionalSaudeId && showFiltroProfissionalSaude) {
                metodoFindAllConfiguracaoVigente = "findAllConfiguracaoHorarioAtendimentoOutrosProfissionaisSaude";
            }

            this.searchDTO = {
                ...this.searchDTO,
                ...searchDTO
            };
            this.loading = true;

            const response = await Api.post("", {
                query: `
                query ($searchDTO: SearchDTOInput) {
                    findAllConfiguracaoHorarioAtendimento: ${metodoFindAllConfiguracaoVigente}(searchDTO: $searchDTO) {
                        content {
                            id
                            dataInicioVigencia
                            dataFimVigencia
                            horaInicioPeriodoAtendimento
                            horaFimPeriodoAtendimento
                            duracao
                        }
                    }
                }
                      `,
                variables: {
                    searchDTO: {
                        ...this.searchDTO,
                        ...searchDTO,
                        unidadeId,
                        profissionalSaudeId,
                        sortField: "dataInicioVigencia",
                        sortDir: "ASC"
                    }
                }
            });

            const list = response.data.data.findAllConfiguracaoHorarioAtendimento.content;
            this.numberOfElements =
                response.data.data.findAllConfiguracaoHorarioAtendimento.numberOfElements;
            this.searchDTO.pageNumber += 1;

            if (
                this.numberOfElements === 0 &&
                string.isEmpty(this.searchDTO.search)
            ) {
                return;
            }

            if (this.searchDTO.pageNumber > 1) {
                this.horarioAtendimentoList = [...this.horarioAtendimentoList, ...list];
            } else {
                this.horarioAtendimentoList = [...list];
            }
        } catch (error) {
            throw error;
        } finally {
            this.loading = false;
        }
    }

    @action
    async getConfigPadrao() {
        try {
            this.loadingConfig = true;
            this.configErrorMessage = null;
            this.agendaValues = [];

            const query = `
                query {
                    configuracaoHorarioAtendimentoPadrao {
                        dataInicioVigencia
                        duracao
                        dataFimVigencia
                    
                        rede {
                            nome
                        }
                    
                        horaInicioPeriodoAtendimento
                        horaFimPeriodoAtendimento
                        profissionalSaude{
                            nome
                        }
                    }
                }
            `;

            const response = await Api.post("", {
                query
            });

            const {
                configuracaoHorarioAtendimentoPadrao
            } = response.data.data;

            const transformResponse = {
                configuracaoHorarioAtendimentoPadrao: {
                    ...configuracaoHorarioAtendimentoPadrao,
                    horaInicioPeriodoAtendimento: moment(
                        Dates.hourAndMinuteForString(
                            configuracaoHorarioAtendimentoPadrao.horaInicioPeriodoAtendimento
                        )
                    ),
                    horaFimPeriodoAtendimento: moment(
                        Dates.hourAndMinuteForString(
                            configuracaoHorarioAtendimentoPadrao.horaFimPeriodoAtendimento
                        )
                    )
                },
            };

            this.configDefault = transformResponse.configuracaoHorarioAtendimentoPadrao;

            this.createAgenda();
        } catch (error) {
            this.configErrorMessage = error.message;
        } finally {
            this.loadingConfig = false;
        }
    }

    @action
    async getConfigById(id) {
        try {
            this.loadingConfig = true;
            this.configErrorMessage = null;
            this.agendaValues = [];

            const query = `
                query {
                    findByIdConfiguracaoHorarioAtendimento(id: ${id}) {
                        id
                        dataInicioVigencia
                        duracao
                        dataFimVigencia
                        periodosAtendimento {
                            id
                            diaSemana
                            horaInicio
                            horaFim
                        }
                        rede{
                            nome
                        }
                        horaInicioPeriodoAtendimento
                        horaFimPeriodoAtendimento
                        profissionalSaude{
                            nome
                        }
                    }
                }
            `;

            const response = await Api.post("", {
                query
            });

            const {
                findByIdConfiguracaoHorarioAtendimento,
            } = response.data.data;

            const configuracaoVigente = findByIdConfiguracaoHorarioAtendimento || null;

            const transformResponse = {
                configuracaoVigente: configuracaoVigente
                    ? {
                          ...configuracaoVigente,
                          horaInicioPeriodoAtendimento: moment(
                              Dates.hourAndMinuteForString(
                                  configuracaoVigente.horaInicioPeriodoAtendimento
                              )
                          ),
                          horaFimPeriodoAtendimento: moment(
                              Dates.hourAndMinuteForString(
                                  configuracaoVigente.horaFimPeriodoAtendimento
                              )
                          ),

                          dataInicioVigencia: moment(
                              configuracaoVigente.dataInicioVigencia
                          ),
                          dataFimVigencia: configuracaoVigente.dataFimVigencia
                              ? moment(configuracaoVigente.dataFimVigencia)
                              : null
                      }
                    : null,
            };

            if (transformResponse.configuracaoVigente) {
                this.setAgenda(transformResponse.configuracaoVigente);
            } else {
                throw new Error('Nenhuma configuração encontrada');
            }
        } catch (error) {
            this.configErrorMessage = error.message;
        } finally {
            this.loadingConfig = false;
        }
    }

    getNameWeekDay(day) {
        let name = day.format("dddd");
        name = RemoveAcento(name);
        name = name.replace("-", "_");

        return name.toUpperCase();
    }

    @action
    async savePeriodos() {
        const isContaisDataInicio = this.configuracoes.some(config => {
            return (
                this.values.id !== config.id &&
                Dates.existInRange(
                    moment(config.dataInicioVigencia, "DD/MM/YYYY"),
                    moment(config.dataFimVigencia, "DD/MM/YYYY"),
                    this.values.dataInicioVigencia
                )
            );
        });

        if (isContaisDataInicio)
            return this.openNotification(
                "Data Inicio de vigência inválida",
                "warning"
            );

        return this.requestSave(this.values.id ? "update" : "create");
    }

    async requestSave(action) {
        try {
            this.saving = true;
            const {
                unidadeId,
                profissionalSaudeId
            } = await this.filtroHeaderStore.getFiltroAtual();

            const {
                horaInicioPeriodoAtendimento,
                horaFimPeriodoAtendimento,
                dataInicioVigencia,
                dataFimVigencia
            } = this.values;

            const values = {
                ...this.values,
                horaInicioPeriodoAtendimento: moment(
                    horaInicioPeriodoAtendimento
                ).format("HH:mm"),
                horaFimPeriodoAtendimento: moment(horaFimPeriodoAtendimento).format(
                    "HH:mm"
                ),
                dataInicioVigencia: moment(dataInicioVigencia).format("YYYY-MM-DD"),
                dataFimVigencia:
                    dataFimVigencia && dataFimVigencia !== ""
                        ? moment(dataFimVigencia).format("YYYY-MM-DD")
                        : null,

                unidade: { id: unidadeId },
                profissionalSaude: { id: profissionalSaudeId }
            };

            const response = await Api.post(
                "",
                JSON.stringify({
                    query: createMutation(
                        {
                            name: `${action}ConfiguracaoHorarioAtendimento`,
                            objType: "ConfiguracaoHorarioAtendimentoInput",
                            objName: "configuracaoHorarioAtendimento",
                            attrsReturn: "id"
                        },
                        "mutation"
                    ),
                    variables: { configuracaoHorarioAtendimento: values }
                })
            );

            if (action === "create") {
                this.addCreatedPeriodo({
                    id:
                        response.data?.data
                            ?.createConfiguracaoHorarioAtendimento?.id,
                    dataInicioVigencia: moment(
                        this.values.dataInicioVigencia
                    ).format("DD/MM/YYYY"),
                    dataFimVigencia: this.values.dataFimVigencia
                        ? moment(this.values.dataFimVigencia).format(
                              "DD/MM/YYYY"
                          )
                        : null
                });
            }
            this.touched = false;

            return response;
        } catch (error) {
            throw error;
        } finally {
            this.saving = false;
        }
    }

    addCreatedPeriodo(periodo) {
        this.setId(periodo.id);
        this.configuracoes.push(periodo);
    }

    @action
    async findById(periodo) {
        try {
            const response = await Api.post(
                "",
                JSON.stringify({
                    query: createMutation(
                        {
                            name: `findByIdConfiguracaoHorarioAtendimento`,
                            objType: "Long",
                            objName: "id",
                            attrsReturn: `
                            dataFimVigencia
                            dataInicioVigencia
                            duracao
                            horaFimPeriodoAtendimento
                            horaInicioPeriodoAtendimento
                            id
                            
                            periodosAtendimento {
                                id
                                diaSemana
                                horaInicio
                                horaFim
                            }
                            
                            rede{
                                nome
                            }   
                            
                            unidade{
                                nome
                            }
                            
                            profissionalSaude{
                                nome
                            }
                            
                        `
                        },
                        "query"
                    ),
                    variables: { id: periodo.id }
                })
            );

            const {
                findByIdConfiguracaoHorarioAtendimento
            } = response.data.data;

            const transformResponse = {
                ...findByIdConfiguracaoHorarioAtendimento,

                horaInicioPeriodoAtendimento: moment(
                    Dates.hourAndMinuteForString(
                        findByIdConfiguracaoHorarioAtendimento.horaInicioPeriodoAtendimento
                    )
                ),
                horaFimPeriodoAtendimento: moment(
                    Dates.hourAndMinuteForString(
                        findByIdConfiguracaoHorarioAtendimento.horaFimPeriodoAtendimento
                    )
                ),

                dataInicioVigencia: moment(
                    findByIdConfiguracaoHorarioAtendimento.dataInicioVigencia
                ).format("YYYY-MM-DD"),
                dataFimVigencia: findByIdConfiguracaoHorarioAtendimento.dataFimVigencia
                    ? moment(
                          findByIdConfiguracaoHorarioAtendimento.dataFimVigencia
                      ).format("YYYY-MM-DD")
                    : null
            };

            this.setAgenda(transformResponse);
        } catch (error) {
            throw error;
        }
    }

    @action
    cancel() {
        this.touched = false;
        this.value = {
            id: null,
            duracao: "",
            horaInicioPeriodoAtendimento: null,
            horaFimPeriodoAtendimento: null,
            dataInicioVigencia: null,
            dataFimVigencia: null,
            periodosAtendimento: []
        };
        this.unselectAll();
    }
}
