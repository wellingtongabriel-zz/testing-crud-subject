import React from 'react';

import {withStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid/Grid";
import Colors from "../../template/Colors";

const style = theme => ({
    item: {
        paddingRight: '26px!important',
        paddingBottom: '5px!important',
    },
    itemTitle: {
        color: Colors.commons.secondary,
        fontWeight: '900',
        fontSize: '10px',
        fontFamily: 'Nexa Black!important',
    },
    itemValue: {
        color: Colors.commons.gray7,
        borderBottom: `1px solid ${Colors.commons.gray6}`,
        height: '16px',
        fontFamily: 'Nexa Book!important', 
    }
});

const ItemGrid = (props) => {
    const {label, classes, size, children} = props;

    return  <Grid item xs={size} className={classes.item}>
                <div className={classes.itemTitle}>{label}</div>
                {children}
            </Grid>
};

export default withStyles(style)(ItemGrid);