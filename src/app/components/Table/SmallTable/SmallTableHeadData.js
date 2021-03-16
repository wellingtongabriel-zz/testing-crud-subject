import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

const SmallTableHeadData = ({ classes, value, noBorder, size = 12 }) => 
    (noBorder
        ? <Grid item xs={size} className={classes.tableHead}>{value}</Grid>
        : <Grid item xs={size} className={classes.tableHeadBorder}>{value}</Grid>
    );

const style = ({
    tableHeadRow: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    tableHead: {
        color: 'rgba(0, 0, 0, 0.54)',
        fontSize: '0.75rem',
        fontWeight: '500',
        padding: '25px' ,
    },
    tableHeadBorder: {
        color: 'rgba(0, 0, 0, 0.54)',
        fontSize: '0.75rem',
        fontWeight: '500',
        padding: '25px' ,
        borderLeft: '2px solid rgb(229, 229, 227)'
    },
});

export default withStyles(style)(SmallTableHeadData);
