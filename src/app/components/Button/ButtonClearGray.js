import React from 'react';
import Button from '@material-ui/core/Button';

import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        borderRadius: 7,
        minHeight: 30,
        width: '100%',
        border: '1px solid ' + theme.palette.commons.gray3,
        padding: 0,
        background: theme.palette.commons.white,
        color: theme.palette.commons.gray3,
        textTransform: 'none',
        whiteSpace: 'nowrap',
        "& span": {
            fontSize: 11
        },
        "&:disabled": {
            color: theme.palette.commons.gray2,
        }
    }
});

const ButtonClearGray = (props) => {
    const {classes} = props;
    return <Button className={classes.root} {...props}/>;
};


export default withStyles(styles)(ButtonClearGray);