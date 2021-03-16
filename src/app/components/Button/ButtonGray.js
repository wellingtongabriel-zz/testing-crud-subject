import React from 'react';
import Button from '@material-ui/core/Button';

import {withStyles} from '@material-ui/core/styles';
import classnames from 'classnames';

const styles = theme => ({
    root: {
        borderRadius: 7,
        minHeight: 30,
        width: '100%',
        border: '1px solid ' + theme.palette.commons.gray,
        padding: 0,
        background: theme.palette.commons.gray,
        color: theme.palette.commons.fontColor,
        textTransform: 'none',
        whiteSpace: 'nowrap',
        "& span": {
            fontSize: 11
        },
        "&:disabled": {
            color: theme.palette.commons.gray2,
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

const ButtonGray = (props) => {
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


export default withStyles(styles)(ButtonGray);