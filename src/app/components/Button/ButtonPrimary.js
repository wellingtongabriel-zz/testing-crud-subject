import React from 'react';
import Button from '@material-ui/core/Button';

import {withStyles} from '@material-ui/core/styles';
import classnames from 'classnames';

const styles = theme => ({
    root: {
        borderRadius: 7,
        minHeight: 30,
        width: '100%',
        border: 0,
        padding: 0,
        background: theme.palette.primary.main,
        color: theme.palette.commons.white,
        textTransform: 'none',
        whiteSpace: 'nowrap',
        "& span": {
            fontSize: 11
        },
        "&:hover": {
            background: theme.palette.primary.dark,
            color: theme.palette.commons.white,
        },
        "&:disabled": {
            background: theme.palette.primary.light,
            color: theme.palette.commons.white,
        }
    },
    noBorderLeft: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
    },
    noBorderRight: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    }
});

const ButtonPrimary = (props) => {
    const {classes, noBorderRight, noBorderLeft, ...others} = props;
    let className = classes.root;
    
    if (noBorderLeft) {
        className = classnames(className, classes.noBorderLeft);
    }
    
    if (noBorderRight) {
        className = classnames(className, classes.noBorderRight);
    }
    
    return <Button className={className} {...others}/>;
};


export default withStyles(styles)(ButtonPrimary);