import React from 'react';
import Button from '@material-ui/core/Button';

import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        borderRadius: 7,
        minHeight: 30,
        width: '100%',
        border: 0,
        padding: 0,
        background: theme.palette.commons.red,
        color: theme.palette.commons.white,
        textTransform: 'none',
        whiteSpace: 'nowrap',
        "& span": {
            fontSize: 11
        },
        "&:hover": {
            background: theme.palette.commons.darkRed,
            color: theme.palette.commons.white,
        }
    }
});

const ButtonAlert = (props) => {
    const {classes} = props;
    return <Button className={classes.root} {...props}/>;
};


export default withStyles(styles)(ButtonAlert);