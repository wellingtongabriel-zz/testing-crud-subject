import React from 'react';
import classnames from "classnames"
import buttonStyles from "./Button.scss"

import Button from '@material-ui/core/Button';

import {withStyles} from '@material-ui/core/styles';

const styleButtonSubmit = theme => ({
    root: {
        background: theme.palette.primary.main,
        borderRadius: 3,
        border: 0,
        color: theme.palette.commons.white,
        height: 48,
        padding: '0 30px',
    }
});

const ButtonSubmit = (props) => {
    const {classes} = props;


    return <Button className={classes.root}  {...props}/>;
};


export default withStyles(styleButtonSubmit)(ButtonSubmit);