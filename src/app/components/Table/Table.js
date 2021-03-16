import React from 'react'

import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from './TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import styles from './Table.style'
import shortid from 'shortid'

const TableApp = (props) => {
    let {classes, dados, className, columns, handleClick, clickable} = props;

    if (className) {
        classes = {
            root: [...classes.root, className.tableRoot],
            table: className.table,
            tableHead: [...classes.tableCellHead, className.tableCellHead]
        };
    }


    return (
        <div className={(classes.root, classes.tabela)}>
            <Table className={classes.table}>
                <TableHead
                    classes={{
                        root: classes.tableHead
                    }}>
                    <TableRow
                    >
                        {columns.map((column, key) => {
                            return (
                                <TableCell key={shortid.generate()}>{column.Header}</TableCell>
                            )
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dados.map(dado => {
                         let toChange = {}
                        return (
                            <TableRow
                                onClick={() => handleClick ? handleClick(dado.id) : null}
                                className={
                                    clickable ? classes.tableRow : classes.tableRowCursorDefault
                                }
                                key={shortid.generate()}>
                                {columns.map((column, key) => {
                                    
                                    if(column.Header === "Valor"){
                                        switch(dado.tipo){
                                            case "DESPESA":
                                                toChange = {
                                                    color: "#FB7676",
                                                }
                                            break;
                
                                            case "RECEITA":
                                            toChange = {
                                                color: "#00C1BF",
                                            }
                                            break;
                
                                            default:
                                                toChange = {}
                                                console.log("default")
                                            break;
                                        }
                                        
                                    } else {
                                        toChange = {}
                                    }
                                    return (
                                        <TableCell key={key} style={toChange} {...column.props}>{column.getValue(dado)}</TableCell>
                                    )
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};


export default withStyles(styles)(TableApp);