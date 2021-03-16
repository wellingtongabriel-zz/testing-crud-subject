import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import SmallTableHead from "./SmallTableHead";
import SmallTableHeadData from "./SmallTableHeadData";
import SmallTableBody from "./SmallTableBody";
import SmallTableRow from "./SmallTableRow";
import SmallTableData from "./SmallTableData";

/**
 * 
 * Componente de Tabela para tabelas pequenas, com poucas colunas 
 */
const SmallTable = ({ classes, children }) =>(
    <Grid container className={classes.table}>
        {children}
    </Grid>
);

const style = ({
    table: {
        display: 'flex',
        flexDirection: 'column',
        border: "1px solid #E5E5E3",
        borderRadius: "10px",
        maxWidth : '700px'
    }
});

SmallTable.Head = SmallTableHead;
SmallTable.Body = SmallTableBody;
SmallTable.Row = SmallTableRow;
SmallTable.Data = SmallTableData;
SmallTable.HeadData = SmallTableHeadData;

export default withStyles(style)(SmallTable);
