import React from 'react';

import {withStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid/Grid";
import Colors from "../../template/Colors";


const style = theme => ({
    item: {
        marginBottom: '5px'
    },
    itemTitle: {
        color: Colors.commons.secondary,
        fontWeight: 'bold',
        fontSize: '10px'
    },
    itemValue: {
        color: Colors.commons.gray7,
        borderBottom: `1px solid ${Colors.commons.gray6}`,
        height: '16px' 
    }
});

const ItemSelect = (props) => {
    const {field, value, classes, size} = props;
    return(
        <Grid item xs={size} className={classes.item}>
            <div className={classes.itemTitle}>{field}</div>
            <div className={classes.itemValue}>{value}</div>
        </Grid>
    );
};


export default withStyles(style)(ItemSelect);