import React from 'react';

import {withStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid/Grid";
import Colors from "../../template/Colors";


const style = theme => ({
    listItem: {
        marginBottom: '5px'
    },
    itemTitle: {
        color: Colors.commons.fontColor,
        fontWeight: 'bold'
    },
    itemValue: {
        color: Colors.commons.fontColor
    }
});

const ListItem = (props) => {
    const {field, value, classes, size} = props;
    return <Grid item xs={size} className={classes.listItem}>
        <span className={classes.itemTitle}>{field}: </span>
        <span className={classes.itemValue}>{value}</span>
    </Grid>;
};


export default withStyles(style)(ListItem);