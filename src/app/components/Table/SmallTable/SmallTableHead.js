import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

const SmallTableHead = ({ classes, children }) => (
    <Grid container className={classes.tableHeadRow}>
        {children}
    </Grid>
);

const style = ({
    tableHeadRow: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingRight: '4px'
    },
});

export default withStyles(style)(SmallTableHead);
