import { action, observable } from "mobx";
import Api from "../config/api";
import string from "../utils/string";

export const MargemPosicaoMedianiz = {
    ESQUERDA: "ESQUERDA",
    SUPERIOR: "SUPERIOR"
};

export const ConfiguracaoImpressaoTamanhoPapel = {
    A4: "A4",
    A5: "A5",
    A6: "A6",
    PERSONALIZADO: "PERSONALIZADO",
};

export const LarguraAlturaPapel = {
    A4: [21, 29.7],
    A5: [14.8, 21],
    A6: [10.5, 14.8],
};

const configuracaoImpressaoDefault = {
    id: null,
    retrato: true,
    margem: {
        direita: 2,
        esquerda: 2,
        inferior: 2,
        superior: 2,
    },
    tamanhoPapel: ConfiguracaoImpressaoTamanhoPapel.A4,
    unidade: null,
    usarCabecalhoRodapePadrao: false,
    usarLogoClinica: false,
    largura: 21,
    altura: 29.7,
};

export default class ConfiguracaoImpressaoStore {
    usuarioStore = null;
    filtroHeaderStore = null;
    @observable errors = [];
    @observable saving = false;
    @observable loadingConfig = true;
    @observable configuracaoImpressao = {
        ...configuracaoImpressaoDefault
    };

    constructor(rootStore) {
        this.usuarioStore = rootStore.usuarioStore;
        this.filtroHeaderStore = rootStore.filtroHeaderStore;
    }

    @action
    getTamanhoPapelList() {
        return Object.keys(ConfiguracaoImpressaoTamanhoPapel).map(value => ({
            value,
            name: string.capitalize(value)
        }));
    }

    @action
    getMargemPosicaoMedianizList() {
        return Object.keys(MargemPosicaoMedianiz).map(value => ({
            value,
            name: string.capitalize(value)
        }));
    }

    @action
    async getConfig(findByProfissionalSaude = true) {
        try {
            this.loadingConfig = true;
            this.reset();
            
            let metodo = 'findConfiguracaoImpressaoUnidadeAtual';
            
            if (findByProfissionalSaude) {
                const { profissionalSaudeId } = await this.filtroHeaderStore.getFiltroAtual();
                metodo = `findConfiguracaoImpressaoByProfissionalSaudeAndUnidadeAtual(profissionalSaude: { id: ${profissionalSaudeId} })`;
            }

            const response = await Api.post("", {
                query: `
                    {
                        configuracaoImpressaoAtual: ${metodo} {
                            id
                            retrato
                            largura
                            altura
                            margem {
                                direita
                                esquerda
                                inferior
                                superior
                            }
                            tamanhoPapel
                            usarCabecalhoRodapePadrao
                            usarLogoClinica
                        }
                    }
                `
            });

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }

            const { configuracaoImpressaoAtual } = response.data.data;

            this.configuracaoImpressao = {
                ...configuracaoImpressaoAtual
            }

        } catch (error) {
            console.error(error);
        } finally {
            this.loadingConfig = false;
        }
    }

    @action
    async save() {
        try {
            if (this.errors.length > 0) {
                return;
            }
            
            this.saving = true;

            const usuarioLogado = await this.usuarioStore.getUsuarioLogado();
            const unidadeId = usuarioLogado?.unidadeAtual?.id;

            const { profissionalSaudeId } = await this.filtroHeaderStore.getFiltroAtual();

            let metodo = 'createConfiguracaoImpressao';

            if (this.configuracaoImpressao.id) {
                metodo = 'updateConfiguracaoImpressao';
            }
            
            const configuracaoImpressao = {
                ...this.configuracaoImpressao,
            };

            const response = await Api.post("", {
                query: `mutation ($configuracaoImpressao: ConfiguracaoImpressaoInput) {
                    configuracaoImpressao: ${metodo}(configuracaoImpressao: $configuracaoImpressao) {
                        id
                    }
                }`,
                variables: {
                    configuracaoImpressao: {
                        id: configuracaoImpressao.id || undefined,
                        ...configuracaoImpressao,
                        largura: string.numberMaskToFloat(configuracaoImpressao.largura),
                        altura: string.numberMaskToFloat(configuracaoImpressao.altura),
                        margem: {
                            ...configuracaoImpressao.margem,
                            superior: string.numberMaskToFloat(configuracaoImpressao.margem.superior),
                            inferior: string.numberMaskToFloat(configuracaoImpressao.margem.inferior),
                            esquerda: string.numberMaskToFloat(configuracaoImpressao.margem.esquerda),
                            direita: string.numberMaskToFloat(configuracaoImpressao.margem.direita),
                        },
                        unidade: {
                            id: unidadeId
                        },
                        profissionalSaude: {
                            id: profissionalSaudeId
                        }
                    }
                }
            });

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }

            const id = response.data.data.configuracaoImpressao.id;

            this.configuracaoImpressao.id = id;
        } catch (error) {
            console.error(error);
        } finally {
            this.saving = false;
        }
    }

    @action
    reset() {
        this.configuracaoImpressao = {
            ...configuracaoImpressaoDefault
        };
    }
}
