import React from 'react';

import {withStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid/Grid";
import Colors from "../../template/Colors";

const style = theme => ({
    listItem: {
        marginBottom: '5px'
    },
    itemTitle: {
        color: Colors.commons.secondary,
        fontSize: '10px',
        fontFamily: 'Nexa Black!important',
    },
    
    itemValue: {
        color: Colors.commons.gray7,
        height: '16px',
        fontFamily: 'Nexa Book!important', 
    },
    itemValueSub: {
        color: Colors.commons.gray7,
        borderBottom: `1px solid ${Colors.commons.gray6}`,
        height: '16px',
        fontFamily: 'Nexa Book!important', 
        marginRight: '4px',
    }
});

const ItemList = (props) => {
    const {field, value, classes, size, lineBottom = true} = props;
    const itemValueClass = lineBottom ? classes.itemValueSub : classes.itemValue;
    return <Grid xs={size} className={classes.listItem}>
        <div className={classes.itemTitle}>{field}</div>
        <div className={itemValueClass}>{value}</div>
    </Grid>;
};


export default withStyles(style)(ItemList);