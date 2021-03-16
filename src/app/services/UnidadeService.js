import Api from "../config/api";
import localStorageService, { UNIDADE_LOGADA_KEY } from "./storage";

export const findUnidadeLogada = async () => {
	try {
		const response = await Api.post("", {
			query: `
				query {
					findUnidadeLogada {
						nome
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
			`
		});

		const data = response?.data?.data?.findUnidadeLogada || {};

		localStorageService.set(UNIDADE_LOGADA_KEY, data);

		return data;
	} catch (error) {
		console.log(error);
		
		const data = {};

		localStorageService.set(UNIDADE_LOGADA_KEY, data);

		return data;
	}
};
