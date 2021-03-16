import React from 'react'
import TableCellMaterial from '@material-ui/core/TableCell';
import {withStyles} from '@material-ui/core/styles';

const style = theme => ({
    root: {
        color: theme.palette.commons.fontColor
    },

    head: {
        textTransform: 'uppercase',
        textAlign: 'center'
    },

    tableCenter: {
        textAlign: 'center'
    }
});


function TableCell(props) {
    const {classes, ...other} = props;
    const bodyStyle = other.center ? classes.tableCenter : '';

    return <TableCellMaterial
        classes={{
            root: classes.root,
            head: classes.head,
            body: bodyStyle
        }}
        {...other}
    />
}

export default withStyles(style)(TableCell);
