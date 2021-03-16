import React from 'react'

import {withStyles} from '@material-ui/core/styles';
import TableHead from '@material-ui/core/TableHead';

import styles from './Table.style'

const TableApp = (props) => {
    const {classes, ...other} = props;


    return (
        <TableHead
            classes={{
                root: classes.tableHeadRoot
            }}
            {...other}>
            {props.children}
        </TableHead>
    );
};


export default withStyles(styles)(TableApp);