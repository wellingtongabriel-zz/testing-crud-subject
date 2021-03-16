import React from "react";
import classnames from 'classnames';
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

const SmallTableBody = ({ classes, children, className }) => (
    <Grid container className={classnames(classes.tableBody, { [`${className}`]: !!className })}>
        {children}
    </Grid>
);

const style = ({
    tableBody: {
        overflow: 'hidden scroll',
        maxHeight: "60vh",
    
        "@media(max-height: 760px)": {
            maxHeight: "50vh"
        }
    },
});

export default withStyles(style)(SmallTableBody);
