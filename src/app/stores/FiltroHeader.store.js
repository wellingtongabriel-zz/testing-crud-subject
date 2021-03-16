import {observable, action} from 'mobx';
import {findUnidadeLogada} from '../services/UnidadeService';
import {AuthApi} from "../config/api";
import {createMutation} from "../pages/Querys";
import localStorageService, {USUARIO_LOGADO_KEY} from "../services/storage";

const defaultUnidades = [
    { name: 'Selecione uma Unidade', value: 0 }
];

const defaultProfissionaisSaude = [
    { name: 'Selecione um Profissional de Saúde', value: 0 }
];

export default class FiltroHeaderStore {
    @observable unidades = defaultUnidades;
    @observable profissionaisSaude = defaultProfissionaisSaude;
    @observable unidade = 0;
    @observable profissionalSaude = 0;
    @observable showFiltroProfissionalSaude = false;
    
    usuarioStore = null;
    profissionalSaudeStore = null;
    
    @action async checkRoles(screen) {
        this.showFiltroProfissionalSaude = false;
        const usuarioLogado = await this.usuarioStore.getUsuarioLogado();
        
        if(!usuarioLogado) {
            return;
        }
        
        const { authorities } = usuarioLogado;
        
        if(!authorities) {
            return;
        }
        
        if (screen === 'AGENDAMENTO') {
            this.showFiltroProfissionalSaude = authorities.some(a => 
                a.authority === 'ROLE_AGENDAMENTO_READ_OUTROS_PROFISSIONAIS');
        }
        if (screen === 'CONFIGURACAO_HORARIO_ATENDIMENTO') {
            this.showFiltroProfissionalSaude = authorities.some(a => 
                a.authority === 'ROLE_CONFIGURACAO_HORARIO_ATENDIMENTO_READ_OUTROS_PROFISSIONAIS');
        }
        if (screen === 'CONFIGURACAO_RECEITA' || screen === 'CADASTRO_CONVENIO') {
            this.showFiltroProfissionalSaude = true;
        }
        
        return this;
    }

    @action async changeFiltros(filtroAtual = { unidadeId: 0, profissionalSaudeId: 0 }, unidadeChanged = false) {
        if(!this.usuarioStore) {
            return;
        }
        
        try {
            const unidadeAtual = await this.usuarioStore.getUnidadeAtual();
            const profissionalSaudeAtual = await this.usuarioStore.getProfissionalSaudeAtual();
            
            if(!unidadeChanged && filtroAtual.unidadeId === 0 && unidadeAtual && unidadeAtual.id) {
                this.unidade = unidadeAtual.id;
                filtroAtual.unidadeId = unidadeAtual.id;
            }
            
            if(!unidadeChanged && filtroAtual.profissionalSaudeId === 0 && profissionalSaudeAtual && profissionalSaudeAtual.id) {
                this.profissionalSaude = profissionalSaudeAtual.id;
                filtroAtual.profissionalSaudeId = profissionalSaudeAtual.id;
            }
        
            if(unidadeChanged) {
                this.profissionalSaude = 0;
                filtroAtual.profissionalSaudeId = 0;
            }
            
            const unidades = await this.usuarioStore.getUnidades();
            const profissionaisSaude = await this.profissionalSaudeStore.findByUnidadeComAgenda(filtroAtual.unidadeId);
            
            this.unidades = defaultUnidades.concat(unidades.map(u => ({
                name: u.nome,
                value: u.id,
            })));
            
            let hasDefaultProfissionalSaude = false;
            
            this.profissionaisSaude = defaultProfissionaisSaude.concat(profissionaisSaude.map(p => {
                if (filtroAtual.profissionalSaudeId === p.id) {
                    hasDefaultProfissionalSaude = true;
                }
                
                return {
                    name: p.nome,
                    value: p.id,
                };
            }));

            if (!hasDefaultProfissionalSaude && profissionaisSaude instanceof Array && profissionaisSaude.length === 1) {
                this.profissionalSaude = profissionaisSaude[0].id;
                filtroAtual.profissionalSaudeId = this.profissionalSaude;
                hasDefaultProfissionalSaude = true;
            }
            
            if (!hasDefaultProfissionalSaude) {
                this.profissionalSaude = 0;
                filtroAtual.profissionalSaudeId = 0;
            }

            await this.alterarUnidadeLogada(filtroAtual.unidadeId);
            
        } catch (error) {
            console.error(error);
        }
    }
    
    @action async getFiltroAtual() {
        try {
            const { unidade, profissionalSaude } = this;
        
            if(!unidade || profissionalSaude === undefined) {
                const unidadeAtual = await this.usuarioStore.getUnidadeAtual();
                const profissionalSaudeAtual = await this.usuarioStore.getProfissionalSaudeAtual();
                const profissionaisSaude = await this.profissionalSaudeStore.findByUnidadeComAgenda(unidadeAtual.id);

                if (profissionaisSaude instanceof Array && profissionaisSaude.length === 1) {
                    this.unidade = unidadeAtual.id;
                    this.profissionalSaude = profissionaisSaude[0].id;
                    return {
                        unidadeId: unidadeAtual.id,
                        profissionalSaudeId: this.profissionalSaude
                    }
                }

                let hasDefaultProfissionalSaude = false;

                profissionaisSaude.forEach(p => {
                    if (profissionalSaudeAtual.id === p.id) {
                        hasDefaultProfissionalSaude = true;
                    }
                });

                if (!hasDefaultProfissionalSaude) {
                    this.unidade = unidadeAtual.id;
                    this.profissionalSaude = 0;
                    return {
                        unidadeId: unidadeAtual.id,
                        profissionalSaudeId: 0
                    }
                }

                this.unidade = unidadeAtual.id;
                this.profissionalSaude = profissionalSaudeAtual.id;
                return {
                    unidadeId: unidadeAtual.id,
                    profissionalSaudeId: profissionalSaudeAtual.id
                }
            }
            
            return {
                unidadeId: unidade,
                profissionalSaudeId: profissionalSaude
            }
        } catch (error) {
            throw error;
        }
    }

    async alterarUnidadeLogada(unidadeId) {

        AuthApi.post('graphql',
            JSON.stringify({
                query: createMutation({
                    name: `alterarUnidadeAtual`,
                    objType: 'Long',
                    objName: 'idUnidade',
                    attrsReturn: `
                        id
                        nome
                        login
                        unidadeAtual {
                            id
                            nome
                            cnpj
                            rede {
                                id
                                nome
                            }
                        }
                        profissionalSaudeAtual {
                            id,
                            nome,
                            cns,
                            cpf
                        }
                        authorities {
                            authority
                        }
                    `
                }, 'mutation'),
                variables: { idUnidade: unidadeId }
            })
        ).then(async (response) => {
            await localStorageService.set(USUARIO_LOGADO_KEY, response.data.data.alterarUnidadeAtual);

            await findUnidadeLogada();
        });
    };
}
