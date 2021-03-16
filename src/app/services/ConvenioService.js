import Api from "../config/api";

export const findConveniosByAtivo = unidadeId =>
    Api.post('', {
        query: `{
            convenios: findAllConvenioList(searchDTO: {
                unidadeId: ${unidadeId || 0},
                ativo: true,
                sortDir: "ASC",
                sortField: "descricao"
            }) {
                id
                descricao
                valorConsulta
            }
        }`
    });

export const findAllConvenio = (
    search = "",
    sort = { sortDir: "ASC", sortField: "descricao" }
) =>
    Api.post("", {
        query: `
        query ($searchDTO: SearchDTOInput) {
            findAllConvenio(searchDTO: $searchDTO) {
                content {
                    id
                    descricao
                    ativo
                }
            }
        }
    `,
        variables: {
            searchDTO: {
                search,
                ...sort
            }
        }
    });

export const saveConvenio = convenio => {
    const method = convenio.id ? 'updateConvenio' : 'createConvenio';
    return Api.post("", {
        query: `
            mutation ($convenio: ConvenioInput) {
                ${method}(convenio: $convenio) {
                    id
                    descricao
                    ativo
                    valorConsulta
                }
            }
        `,
        variables: { convenio }
    });
};

export const findByIdConvenio = id => Api.post("", {
    query: `
        query ($id: Long) {
            findByIdConvenio(id: $id) {
                id
                descricao
                ativo
                unidade {
                    id
                }
                valorConsulta
            }
        }
    `,
    variables: { id }
})