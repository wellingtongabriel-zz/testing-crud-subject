import React from 'react';

import TextField from '@material-ui/core/TextField';
import {withStyles} from "@material-ui/core/styles/index";
import classnames from "classnames"
import {primaryColor} from "../../assets/jss/appHealth.style";

const style = theme => ({
    root: {
        width: '100%'
    },
    inputRoot: {
        border: 1,
        borderColor: theme.palette.commons.gray3,
        borderStyle: 'solid',
        borderRadius: 6,
        color: theme.palette.commons.fontColor,
        paddingLeft: 10,
        fontSize: 16
    },
    inputError: {
        borderColor: theme.palette.commons.darkRed
    },
    input: {
        padding: '7px 0'
    },
    inputFocused: {
        borderColor: theme.palette.primary.main
    },

    white: {
        backgroundColor: "#fff",
        color: primaryColor
    }
});


export const Input = (props) => {
    const {classes, classInputRoot, classInput, color, InputProps, ...rest} = props;

    const rootInputClasse = classnames(
        classes.inputRoot,
        classInputRoot,
        {
            [classes[color]]: color,
        }
    );

    const inputClasse = classnames(
        classes.input,
        classInput
    );

    return (
        <TextField
            className={classes.root}
            InputProps={{
                ...InputProps,
                disableUnderline: true,
                classes: {
                    root: rootInputClasse,
                    input: inputClasse,
                    focused: classes.inputFocused,
                    error: classes.inputError
                },
            }}
            {...rest}
        />
    );


};


export default withStyles(style)(Input);
