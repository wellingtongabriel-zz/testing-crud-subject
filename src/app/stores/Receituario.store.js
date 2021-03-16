import { action } from "mobx";
import Api from "../config/api";

export default class ReceituarioStore {
    @action async criarEImprimirReceita(variables) {
        try {
            const response = await Api.post("", {
                query: `
                    mutation ($receita: ReceitaInput) {
                        imprimir: criarEImprimirReceita(receita: $receita) {
                            id, pdf
                        }
                    }
                `,
                variables: variables
            });

            if (response.data.errors) {
                throw response.data.errors[0];
            }
            return response.data.data.imprimir;
        } catch (error) {
            throw error;
        }
    }

    @action async imprimirReceita(variables) {
        try {
            const response = await Api.post("", {
                query: `
                mutation ($id: Long) {
                    imprimir: imprimirReceita(id: $id)
                }
            `,
                variables: variables
            });

            if (response.data.errors) {
                throw response.data.errors[0];
            }
            return response.data.data.imprimir;
        } catch (error) {
            throw error;
        }
    }

    @action async criarEImprimirAssinadaReceita(variables) {
        try {
            const response = await Api.post("", {
                query: `
                mutation ($receita: ReceitaInput, $tokenAplicativo: String) {
                    imprimir: criarEImprimirAssinadaReceita(receita: $receita, tokenAplicativo: $tokenAplicativo) {
                        id, pdf
                    }
                }
            `,
                variables: variables
            });

            if (response.data.errors) {
                throw response.data.errors[0];
            }
            return response.data.data.imprimir;
        } catch (error) {
            throw error;
        }
    }

    @action async imprimirAssinadaReceita(variables) {
        try {
            const response = await Api.post("", {
                query: `
                mutation ($id: Long, $tokenAplicativo: String) {
                    imprimir: imprimirAssinadaReceita(id: $id, tokenAplicativo: $tokenAplicativo)
                }
            `,
                variables: variables
            });

            if (response.data.errors) {
                throw response.data.errors[0];
            }
            return response.data.data.imprimir;
        } catch (error) {
            throw error;
        }
    }
}