import React from 'react';
import { Typography } from "@material-ui/core";
import Moment from 'moment';

export const handleItemClick = (id, sujeitoAtencaoStore) => {
    sujeitoAtencaoStore.edit(id);
}

export const getColumns = (props, sujeitoAtencaoStore) => {

    return [
        {
            Header: "Nome",
            getValue: row => {
                return (
                    <Typography
                        component="p"
                        key={row.id}
                        onClick={() => handleItemClick(row.id, sujeitoAtencaoStore)}>
                        {row.nome}
                    </Typography>

                )
            }
        },
        {
            Header: "Cpf",
            getValue: row => row.cpf
        },
        {
            Header: "Data de Nascimento",
            getValue: row => row.dataNascimento ? Moment(row.dataNascimento).format('DD/MM/YYYY') : '--'
        },
        {
            Header: "Email",
            getValue: row => row?.contato?.email ?? '--'
        },
        {
            Header: "Telefone Principal",
            getValue: row => row?.contato?.telefonePrincipal ?? '--'
        },
        {
            Header: "Municipio",
            getValue: row => row.endereco?.municipio ? `${row.endereco?.municipio?.uf}/${row.endereco?.municipio?.nome}` : '--'
        }
    ];
};