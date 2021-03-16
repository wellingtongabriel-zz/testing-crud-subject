import { action, observable } from 'mobx';
import moment from 'moment';
import Api from "../config/api";
import { buildUrlDownload, buildUrlMiniatura, buildUrlFotoPerfil, db } from '../config/config';
import {isEmpty} from '../utils/checkObj';
import LocalStorage from "../services/localStorage";
import localStorageService, { ACCESS_TOKEN_KEY } from '../services/storage';

export default class ProntuarioStore {
    atendimentoStore = null;

    usuarioStore = null;

    chatStore = null;

    profissionalSaudeStore = null;

    totalPagesMensagens = 0;

    messagesScrollToBottom = false;

    filterAgendamentoDefault = {
        pageSize: 20,
        pageNumber: 0,
        sortField: 'horaInicio',
        sortDir: 'ASC'
};

    filterEntradaDefault = {
        pageSize: 100,
        pageNumber: 0
    };

    @observable tipos = [];

    @observable receituario = {
        open: false
    };

    @observable previewDocumento = {
        open: false,
        descricao: ""
    };
    
    @observable notification = {
        isOpen: false,
        variant: '',
        message: ''
    };

    @observable isOpenAtendimentoModal = false;

    @observable isOpenModalVinculoSujeito = false;

    @observable modalVinculoSujeitoAlertTitle = "";

    @observable modalVinculoSujeitoAlertDescription = "";

    @observable usuarioLogado = null;

    @observable agendamentoSelected = null;

    @observable sujeitoAtencaoSelected = null;

    @observable mensagemProntuario = "";

    @observable searchTextAgendamento = "";

    @observable sendingMessagemProntuario = false;

    @observable listEntradas = [];
    @observable agendamentos = [];

    @observable loadingCadastrarNovoSujeito = false;
    @observable loadingAgendamentos = false;
    @observable loadingAllEntradas = false;
    @observable loadingMoreMensagens = false;
    @observable hasMoreMensagens = false;
    
    @observable timer = {
        initialTime: 0
    };

    constructor(rootStore) {
        this.atendimentoStore = rootStore.atendimentoStore;
        this.usuarioStore = rootStore.usuarioStore;
        this.chatStore = rootStore.chatStore;
        this.profissionalSaudeStore = rootStore.profissionalSaudeStore;
    }

    @action async findAllEntradaProntuario({ filter = {}, pageNumber = 0, withLoading = true } = {}, sujeito = {}) {
        try {
            this.loadingMoreMensagens = true;

            if(withLoading) {
                this.loadingAllEntradas = true;
            }

            let sujeitoAtencao = sujeito
            if(isEmpty(filter) && isEmpty(sujeito)) {
                sujeitoAtencao = this.agendamentoSelected.sujeitoAtencao;
            }
            
            if(!sujeitoAtencao) {
                return;
            }

            this.sujeitoAtencaoSelected = {
                ...sujeitoAtencao,
                peso: sujeitoAtencao.peso ? `${sujeitoAtencao.peso}`.replace('.', ',') : null,
                altura: sujeitoAtencao.altura ? `${sujeitoAtencao.altura}`.replace('.', ',') : null
            };

            const sujeitoAtencaoId = this.sujeitoAtencaoSelected.id;

            if (!sujeitoAtencaoId) {
                throw new Error('Nenhum sujeito de atenção selecionado!');
            }

            const usuarioLogado = await this.usuarioStore.getUsuarioLogado();
            this.usuarioLogado = usuarioLogado;

            const unidadeId = usuarioLogado.unidadeAtual.id;
            const profissionalSaudeId = usuarioLogado.profissionalSaudeAtual.id;
            
            this.mensagemProntuario = LocalStorage.get(`${sujeitoAtencaoId}-${profissionalSaudeId}`) || "";

            const filterTipos = this.tipos.includes('TEXTO') ? [...this.tipos, 'ARQUIVO', 'IMAGEM'] : this.tipos;

            const response = await Api.post(
                '',
                {
                    query: `
                        query ($page: SearchEntradaProntuarioDTOInput) {
                            query: findAllEntradaProntuario(searchDTO: $page) {
                                last
                                totalPages
                                content {
                                    id
                                    dataHoraLancamento
                                    texto
                                    tipo
                                    urlDownload
                                    urlMiniatura
                                    profissionalSaude {
                                        primeiroNome
                                        nome
                                        usuario {
                                            fotoPerfil
                                        }
                                    }
                                }
                            }
                        }
                    `,
                    variables: {
                        page: {
                            ...this.filterEntradaDefault,
                            ...filter,
                            pageNumber,
                            tipos: filterTipos || [],
                            unidadeId,
                            profissionalSaudeId,
                            sujeitoAtencaoId,
                            sortField: 'dataHoraLancamento',
                            sortDir: 'DESC'
                        }
                    }
                },
            );

            if (!response.data.data) {
                throw new Error('Não foi possível carregar o prontuário.');
            }

            if (!response.data.data.query) {
                throw new Error('Não foi possível carregar o prontuário.');
            }

            const { content } = response.data.data.query;
            const token = await localStorageService.get(ACCESS_TOKEN_KEY);
            
            const data = content.map(item => {
                let showDate = false;
                const hour = typeof item.dataHoraLancamento === 'string'
                    ? moment(item.dataHoraLancamento.split('[')[0]).format('HH:mm')
                    : null;
                const date = typeof item.dataHoraLancamento === 'string'
                    ? moment(item.dataHoraLancamento.split('[')[0]).format('DD/MM/YYYY')
                    : null;

                return {
                    id: item.id,
                    date,
                    hour,
                    texto: item.texto,
                    tipo: item.tipo,
                    profissionalSaude: item.profissionalSaude,
                    showDate,
                    urlDownload: typeof item.urlDownload === 'string' ? buildUrlDownload(item.urlDownload, token) : null,
                    urlMiniatura: typeof item.urlMiniatura === 'string' ? buildUrlMiniatura(item.urlMiniatura, token) : null,
                    urlFotoPerfil: typeof item.profissionalSaude?.usuario?.fotoPerfil === 'string' ? buildUrlFotoPerfil(item.profissionalSaude?.usuario?.fotoPerfil, token) : null,
                };
            });

            let list = [];
            
            if (pageNumber > 0) {
                const listLoaded = [...this.listEntradas].reverse();
                list = [...listLoaded, ...data];
                this.loadingMoreMensagens = false;
            } else {
                list = [...data];
                this.loadingMoreMensagens = false;
                this.messagesScrollToBottom = true;
            }
            this.listEntradas = list.map((item, key) => {
                let showDate = false;
                const nextKey = key + 1;
                if (list[nextKey]) {
                    const nextDate = list[nextKey].date;
                    showDate = nextDate !== item.date;
                } else {
                    showDate = true;
                }

                return {
                    ...item,
                    showDate
                };
            }).reverse();

            this.totalPagesMensagens = response.data.data.query.totalPages;
            this.hasMoreMensagens = response.data.data.query.last ? false : true;
        } catch (error) {
            throw error;
        } finally {
            if(withLoading) {
                this.loadingAllEntradas = false;
            }
        }
    }

    @action async findAllAgendamento(filter = {}, isShowLoading = true, persist = false) {
        try {
            const usuarioLogado = await this.usuarioStore.getUsuarioLogado();
            this.usuarioLogado = usuarioLogado;

            if (isShowLoading) {
                this.atendimentoStore.filterEvents();
                this.loadingAgendamentos = true;
                this.loadingAllEntradas = true;
                if(persist === false) this.sujeitoAtencaoSelected = null;
            }

            


            let checkDateFilterInicial = !isEmpty(filter) && filter.dataInicial && filter.dataInicial !== '' 
            let checkDateFilterFinal = !isEmpty(filter) && filter.dataInicial && filter.dataInicial !== '' 

            const filterAgendamento = {
                ...this.filterAgendamentoDefault,
                ...filter,
                unidadeId: usuarioLogado.unidadeAtual.id,
                profissionalSaudeId: usuarioLogado.profissionalSaudeAtual.id,
                dataInicial: checkDateFilterInicial ?  filter.dataInicial : moment().startOf('day').format('YYYY-MM-DD'),
                dataFinal: checkDateFilterFinal ? filter.dataFinal : moment().endOf('day').format('YYYY-MM-DD')
            };

            const response = await Api.post('', {
                query: `
                    query ($filter: SearchAgendamentoDTOInput) {
                        findAllAgendamentoList(searchDTO: $filter){
                            id
                            nome
                            data
                            horaInicio
                            horaFim
                            tipo
                            situacao
                            dataInicioAtendimento
                            dataFimAtendimento
                            dataChegadaSujeitoAtencao
                            dataNascimento
                            sujeitoAtencao {
                                id
                                nome
                                dataNascimento
                                quemIndicou
                                altura
                                peso
                                fotoPerfil
                                dadosConvenio {
                                    convenio {
                                        descricao
                                    }
                                }
                            }
                        }
                    }
                `,
                variables: { 
                    filter: filterAgendamento
                }
            });

            if(response.data.errors) {
                throw response.data.errors[0];
            }

            const { findAllAgendamentoList } = response.data.data;

            const agendamentos = this.filterAgendamentosByStatus(findAllAgendamentoList, this.atendimentoStore.status);
            const token = await localStorageService.get(ACCESS_TOKEN_KEY);

            agendamentos.forEach(function(agendamento){
                if(agendamento.sujeitoAtencao) {
                    if (agendamento.sujeitoAtencao.dataNascimento) {
                        if (agendamento.sujeitoAtencao.dataNascimento.substring(5, 10) === moment().format("MM-DD")) {
                            agendamento.aniversario = true;
                        }
                    }

                    if (agendamento.sujeitoAtencao.fotoPerfil) {
                        agendamento.urlFotoPerfil = buildUrlFotoPerfil(agendamento.sujeitoAtencao.fotoPerfil, token)
                    }
                }

                if (agendamento.dataNascimento) {
                    if (agendamento.dataNascimento.substring(5, 10) === moment().format("MM-DD")) {
                        agendamento.aniversario = true;
                    }
                }
            });

            this.agendamentos = agendamentos;

            if(this.agendamentos[0]) {
                if(isShowLoading){
                    this.loadingAllEntradas = !!this.agendamentos.length;

                    let checkDate = checkDateFilterInicial && checkDateFilterFinal;

                    const prontuarioAgendamentoSelecionado = JSON.parse(await db.get("prontuarioAgendamentoSelecionado"));

                    this.selectAgendamento(prontuarioAgendamentoSelecionado || this.agendamentos[0], checkDate, persist);
                } else {
                    this.selectAgendamento(this.agendamentoSelected, false);
                }
            }

        } catch (error) {
            this.agendamentos = [];
            this.loadingAllEntradas = false;
            throw error;
        } finally {
            this.loadingAllEntradas = false;
            this.loadingAgendamentos = false;
        }
    }

    loadEntradas = async (agendamento) => {
        const sujeitoAtencaoNaoVinculado = !(agendamento.sujeitoAtencao && agendamento.sujeitoAtencao.id);
        if(sujeitoAtencaoNaoVinculado) {
            this.listEntradas = [];
            this.sujeitoAtencaoSelected = null;
            this.modalVinculoSujeitoAlertTitle = `O agendamento ${agendamento.nome} não possui sujeito de atenção.`;
            this.modalVinculoSujeitoAlertDescription = `Vincule um sujeito existente ou cadastre um novo.`;
            this.isOpenModalVinculoSujeito = true;
            return;
        }
        this.mensagemProntuario = "";
        await this.findAllEntradaProntuario();
    }

    getInitialTime = (agendamento) => {
        if (agendamento.dataInicioAtendimento && !agendamento.dataFimAtendimento) {
            return moment().diff(moment(agendamento.dataInicioAtendimento), 'miliseconds');
        } 
        if (agendamento.dataInicioAtendimento && agendamento.dataFimAtendimento) {
            return moment(agendamento.dataFimAtendimento).diff(moment(agendamento.dataInicioAtendimento), 'miliseconds');
        } 
        return 0;
        
    }

    @action async selectAgendamento(agendamento, fetchEntradas = true, eventPersist = false) {
        try {
            if(!eventPersist){
                this.agendamentos = this.agendamentos.map(item => {
                
                    if(item.id === agendamento.id ) {
                        return {
                            ...item,
                            selected: true,
                        };
                    }
    
                    return {
                        ...item,
                        selected: false,
                    };
                });
    
                this.agendamentoSelected = {
                    ...agendamento,
                    selected: true
                };
            }            
            
            this.timer.initialTime = this.getInitialTime(agendamento);
            
            if(fetchEntradas){
                this.loadEntradas(agendamento);
            }
        } catch (error) {
            throw error;
        }
    }

    @action async selectFirstAgendamento() {
        const agendamento = this.agendamentos[0];
        try {
            if (agendamento) {
                this.agendamentoSelected = {
                    ...agendamento,
                    selected: true
                };
                
                this.timer.initialTime = this.getInitialTime(agendamento);
                
                this.loadEntradas(agendamento);
            }
        } catch (error) {
            throw error;
        }
    }

    @action async chamarProximoAtendimento() {
        try {
            const unidadeAtual = await this.usuarioStore.getUnidadeAtual();
            
            const profissionaisSaude = await this.profissionalSaudeStore.findByUnidadeSemAgenda(unidadeAtual?.id);

            if (!profissionaisSaude instanceof Array) {
                throw new Error('Profissionais de Saúde deve ser um array');
            }

            return Promise.all(profissionaisSaude.map(profissionalSaude => {
                const rooms = this.chatStore.rooms;
                let selectedRoomId = null;
                rooms.forEach(room => {
                    room.users.forEach(item => {
                        if (item.user?.id === profissionalSaude.usuario.id) {
                            selectedRoomId = room._id;
                        }
                    });
                });

                if (!selectedRoomId) {
                    return null;
                }

                const sujeitoAtencao = this.sujeitoAtencaoSelected;
                const primeiroNomeSujeito = typeof sujeitoAtencao?.nome === 'string' ? sujeitoAtencao.nome.split(' ')[0] : '';
    
                return this.chatStore.createMessage({ 
                    data: 'Chamar o paciente ' + primeiroNomeSujeito,
                    type: 'text',
                    room: selectedRoomId
                });
            }));
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    @action async findReceitaByIdEntradaProntuario(id) {
        try {
            const response = await Api.post('', {
                query: `
                    query {
                        content: findReceitaByIdEntradaProntuario(id: ${id}){
                            id
                            tipo
                            dataHoraLancamento
                            receitaItens {
                                id
                                adscricao
                                formaFarmaceutica
                                remedio
                                receitaItemTipoUso
                                quantidade
                                principioAtivo
                            }
                            sujeitoAtencao {
                                id
                                nome
                                endereco {
                                    nomeLogradouro
                                    numero
                                    cep
                                    municipio {
                                        id
                                        nome
                                    }
                                    estado {
                                        id
                                        uf
                                    }
                                }
                            }
                            unidade {
                                nome
                                nomeFantasia
                                endereco {
                                    bairro
                                    complemento
                                    municipio {
                                        nome
                                    }
                                    estado {
                                        uf
                                    }
                                    nomeLogradouro
                                    numero
                                }
                                telefonePrincipal
                            }
                        }
                    }
                `
            });

            if(response.data.errors) {
                throw response.data.errors[0];
            }

            const { content } = response.data.data;

            return content;

        } catch (error) {
            throw error;
        }
    }

    @action async openDocumentoByIdEntradaProntuario(id) {
        try {
            this.previewDocumento = {
                open: true,
                content: {
                    isLoading: true,
                }
            };
            const response = await Api.post('', {
                query: `
                    query {
                        content: findDocumentoByIdEntradaProntuario(id: ${id}) {
                        documento
                        unidade {
                          cnpj
                          nome
                          telefonePrincipal
                          endereco {
                            bairro
                            cep
                            complemento
                            estado {
                              nome
                              uf
                            }
                            municipio {
                              nome
                            }
                            nomeLogradouro
                            numero
                          }
                        }
                      }
                    }
                `
            });

            if(response.data.errors) {
                throw response.data.errors[0];
            }

            const { content } = response.data.data;

            this.previewDocumento = {
                open: true,
                content
            };

        } catch (error) {
            this.previewDocumento = {
                open: false,
            };
            throw error;
        }
    }

    @action async updateSujeitoAtencaoAlturaPesoNoAtendimento() {
        try {
            if(!this.agendamentoSelected || !this.sujeitoAtencaoSelected) {
                return;
            }

            let { altura, peso } = this.sujeitoAtencaoSelected;

            altura = typeof altura === 'string' && altura.trim().length
                ? altura
                : `${this.agendamentoSelected.sujeitoAtencao.altura || ''}`;

            altura = typeof altura === 'string' && altura.trim().length
                ? altura
                : `${this.agendamentoSelected.sujeitoAtencao.altura || ''}`;

            if(typeof altura === 'string' && altura.trim().length) {
                altura = parseFloat(altura.replace(',', '.'));
            } else {
                console.warn('Por favor, preencha o campo altura.')
                return;
            }

            peso = typeof peso === 'string' && peso.trim().length
                ? peso
                : `${this.agendamentoSelected.sujeitoAtencao.peso || ''}`;

            if(typeof peso === 'string' && peso.trim().length) {
                peso = parseFloat(peso.replace(',', '.'));
            } else {
                console.warn('Por favor, preencha o campo peso.')
                return;
            }

            const response = await Api.post('', {
                query: `
                    mutation($agendamento: AgendamentoInput, $sujeitoAtencao: SujeitoAtencaoInput){
                        updateSujeitoAtencaoAlturaPesoNoAtendimento(agendamento: $agendamento, sujeitoAtencao: $sujeitoAtencao){
                            id
                        }
                    }
                `,
                variables: {
                    agendamento: {
                        id: this.agendamentoSelected.id
                    },
                    sujeitoAtencao: {
                        id: this.sujeitoAtencaoSelected.id,
                        altura,
                        peso
                    }
                }
            });

            if (response.data.errors) {
                throw response.data.errors[0];
            }

            this.sujeitoAtencaoSelected = {
                ...this.sujeitoAtencaoSelected,
                altura: this.sujeitoAtencaoSelected.altura,
                peso: this.sujeitoAtencaoSelected.peso ? `${this.sujeitoAtencaoSelected.peso}`.replace('.', ',') : null,
            };

            this.agendamentoSelected = {
                ...this.agendamentoSelected,
                sujeitoAtencao: {
                    ...this.sujeitoAtencaoSelected
                },
            };

            this.agendamentos = this.agendamentos.map(item => {
                if(item.id === this.agendamentoSelected.id) {
                    return {
                        ...this.agendamentoSelected,
                    };
                }

                return {
                    ...item,
                };
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
    @action async iniciarAtendimento(agendamento) {
        try {
            const id = agendamento?.id;
            
            if(!id) {
                return;
            }
            
            this.agendamentos = this.agendamentos.map(a => {
                if (a.id === id) {
                    this.agendamentoSelected = {
                        ...agendamento,
                    };
                    return this.agendamentoSelected;
                }
                
                return a;
            });

            const response = await Api.post('', {
                query: `
                    mutation {
                        iniciarAtendimento(id: ${id}){
                            id
                        }
                    }
                `,
            });

            if (response.data.errors) {
                throw response.data.errors[0];
            }

            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
    @action async finalizarAtendimento(agendamento) {
        try {
            const id = agendamento?.id;
            
            if(!id) {
                return;
            }
            
            this.agendamentos = this.agendamentos.map(a => {
                if (a.id === id) {
                    this.agendamentoSelected = {
                        ...agendamento,
                    };
                    return this.agendamentoSelected;
                }
                
                return a;
            });

            const response = await Api.post('', {
                query: `
                    mutation {
                        finalizarAtendimento(id: ${id}){
                            id
                        }
                    }
                `,
            });

            if (response.data.errors) {
                throw response.data.errors[0];
            }

            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    @action async createEntradaProntuarioTipoTexto({filter = {}, withLoading = false} = {},sujeito = {}) {
        try {
            const texto = this.mensagemProntuario;
            const sujeitoAtencaoSelected = this.sujeitoAtencaoSelected;
            if(typeof texto !== "string" || texto.trim().length === 0) {
                return;
            }

            if(!sujeitoAtencaoSelected) {
                throw new Error('Nenhum sujeito de atenção selecionado.');
            }

            if(!sujeitoAtencaoSelected.id) {
                throw new Error('Nenhum sujeito de atenção selecionado.');
            }

            LocalStorage.remove(sujeitoAtencaoSelected.id);
            this.sendingMessagemProntuario = true;

            const usuarioLogado = await this.usuarioStore.getUsuarioLogado();

            const mensagem = {
                tipo: 'TEXTO',
                texto,
                sujeitoAtencao: {
                    id: sujeitoAtencaoSelected.id
                },
                unidade: {
                    id: usuarioLogado.unidadeAtual.id
                },
                profissionalSaude: {
                    id: usuarioLogado.profissionalSaudeAtual.id
                }
            };

            const response = await Api.post('', {
                query: `
                    mutation($mensagem: EntradaProntuarioInput){
                        createEntradaProntuarioTipoTexto(entradaProntuario: $mensagem){
                            id
                        }
                    }
                `,
                variables: { mensagem }
            });

            if (response.data.errors) {
                throw response.data.errors[0];
            }

            this.mensagemProntuario = "";
             this.findAllEntradaProntuario({filter, withLoading: false }, sujeito);

        } catch (error) {
            throw error;
        } finally {
            this.sendingMessagemProntuario = false;
        }
    }
    
    @action async createEntradaProntuarioTeleconsulta(inicio, fim) {
        try {
            if(!inicio) {
                throw new Error('Horário início é obrigatório.');
            }
            if(!fim) {
                throw new Error('Horário fim é obrigatório.');
            }

            const sujeitoAtencaoSelected = this.sujeitoAtencaoSelected;
            if(!sujeitoAtencaoSelected) {
                throw new Error('Nenhum sujeito de atenção selecionado.');
            }

            if(!sujeitoAtencaoSelected.id) {
                throw new Error('Nenhum sujeito de atenção selecionado.');
            }

            LocalStorage.remove(sujeitoAtencaoSelected.id);
            this.sendingMessagemProntuario = true;

            const usuarioLogado = await this.usuarioStore.getUsuarioLogado();
            const inicioFormatted = inicio.format("HH:mm");
            const fimFormatted = fim.format("HH:mm");
            const duracao = moment.utc(fim.diff(inicio)).format("HH:mm")

            const mensagem = {
                tipo: 'TEXTO',
                texto: `Foi realizado atendimento via teleconsulta duração de ${duracao} - Das ${inicioFormatted} até ${fimFormatted}`,
                sujeitoAtencao: {
                    id: sujeitoAtencaoSelected.id
                },
                unidade: {
                    id: usuarioLogado.unidadeAtual.id
                },
                profissionalSaude: {
                    id: usuarioLogado.profissionalSaudeAtual.id
                }
            };

            const response = await Api.post('', {
                query: `
                    mutation($mensagem: EntradaProntuarioInput){
                        createEntradaProntuarioTipoTexto(entradaProntuario: $mensagem){
                            id
                        }
                    }
                `,
                variables: { mensagem }
            });

            if (response.data.errors) {
                throw response.data.errors[0];
            }

            this.findAllEntradaProntuario({ filter: {}, withLoading: false }, {});

        } catch (error) {
            throw error;
        } finally {
            this.sendingMessagemProntuario = false;
        }
    }

    @action async createEntradaProntuarioFromDocumento() {
        try {
            const method = this.previewDocumento.isImage ? 'createEntradaProntuarioTipoImagem' : 'createEntradaProntuarioTipoArquivo';

            const texto = this.previewDocumento.descricao;
            const sujeitoAtencaoSelected = this.sujeitoAtencaoSelected;

            if(!this.previewDocumento.file instanceof File) {
                throw new Error('Nenhum arquivo selecionado.');
            }

            if(!sujeitoAtencaoSelected) {
                throw new Error('Nenhum sujeito de atenção selecionado.');
            }

            if(!sujeitoAtencaoSelected.id) {
                throw new Error('Nenhum sujeito de atenção selecionado.');
            }

            this.previewDocumento.sending = true;

            const usuarioLogado = await this.usuarioStore.getUsuarioLogado();

            const mensagem = {
                texto,
                sujeitoAtencao: {
                    id: sujeitoAtencaoSelected.id
                },
                unidade: {
                    id: usuarioLogado.unidadeAtual.id
                },
                profissionalSaude: {
                    id: usuarioLogado.profissionalSaudeAtual.id
                }
            };

            const nome = this.getNomeFromFile(this.previewDocumento.file);
            const base64 = await this.getBase64FromFile(this.previewDocumento.file);
            const extensao = this.getExtensaoFromFile(this.previewDocumento.file);

            const response = await Api.post('', {
                query: `
                    mutation($mensagem: EntradaProntuarioInput, $objetoAmazonS3DTO: ObjetoAmazonS3DTOInput){
                        ${method}(entradaProntuario: $mensagem, objetoAmazonS3DTO: $objetoAmazonS3DTO){
                            id
                        }
                    }
                `,
                variables: {
                    mensagem,
                    objetoAmazonS3DTO: {
                        nome,
                        base64,
                        extensao
                    }
                }
            });

            if (response.data.errors) {
                throw response.data.errors[0];
            }

            this.closePreviewDocumento();
            this.mensagemProntuario = "";
            this.findAllEntradaProntuario({ withLoading: false });

        } catch (error) {
            this.previewDocumento.sending = false;
            throw error;
        }
    }

    @action filterAgendamentosByStatus(agendamentos, status) {
        return agendamentos
                .filter(agendamento => status.includes(agendamento.situacao));
    }

    @action openModalImage(entrada) {
        this.previewDocumento = {
            open: true,
            descricao: entrada.texto,
            imageUrl: entrada.urlDownload,
            isImage: true,
            previewOnly: true
        };
    }

    @action openPreviewDocumento(file, previewOnly = false) {
        const isImage = file.type.search('image/') !== -1;
        const imageUrl = isImage ? window.URL.createObjectURL(file) : null;

        this.previewDocumento = {
            open: true,
            descricao: "",
            file,
            imageUrl,
            isImage,
            previewOnly
        };
    }

    @action closePreviewDocumento() {
        this.previewDocumento = {
            open: false,
            descricao: "",
            file: null,
            imageUrl: null,
            isImage: false,
            previewOnly: false
        };
    }
    
    @action resetNotification() {
        this.notification = {
            message: '',
            variant: '',
            isOpen: false,
        };
    }
    
    @action closeNotification(reason) {
        if (reason === 'clickaway') {
            return;
        }

        this.resetNotification();
    }

    @action openNotification(message, variant, delay = 2000) {
        this.notification = {
            message,
            variant,
            isOpen: true,
        };
        
        if (delay) {
            const timeoutId = setTimeout(() => {
                this.resetNotification();
                clearTimeout(timeoutId);
            }, delay);
        }
    }

    getBase64FromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = () => resolve(window.btoa(reader.result));
            reader.onerror = error => reject(error);
        });
    }

    getExtensaoFromFile(file) {
        return '.' + file.name.split('.').pop();
    }

    getNomeFromFile(file) {
        return file.name.replace(this.getExtensaoFromFile(file), '');
    }
}
