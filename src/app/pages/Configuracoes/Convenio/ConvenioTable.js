import React from "react";
import { Checkbox } from "@material-ui/core";
import SmallTable from "../../../components/Table/SmallTable/SmallTable";

const ConvenioTable = ({ search, convenios, onClickRow }) => (
    <SmallTable>
        <SmallTable.Head>
            <SmallTable.HeadData size={9} value="Nome" noBorder />
            <SmallTable.HeadData size={3} value="Status" />
        </SmallTable.Head>
        <SmallTable.Body>                    
            {convenios
                .filter(convenio => convenio.descricao.toUpperCase().includes(search.toUpperCase()))
                .map(convenio => (
                    <SmallTable.Row key={convenio.id} onClick={() => onClickRow(convenio.id)}>
                        <SmallTable.Data size={9} value={convenio.descricao} noBorder/>
                        <SmallTable.Data size={3}
                            value={<Checkbox color="primary" checked={convenio.ativo}/>} 
                        />
                    </SmallTable.Row>
                ))
            }
        </SmallTable.Body>
    </SmallTable>
);

export default ConvenioTable;