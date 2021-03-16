import React from 'react';
import classnames from "classnames"
import inputStyle from "./Input.scss"

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';
import {withStyles} from "@material-ui/core/styles/index";

export const Input = ({className, ...props}) => {

    const style = classnames(
        'border-focus-input-primary',
        inputStyle["input-form"],
        className
    );

    return (
        <div className={style}>
            <label htmlFor={props.id}>{props.label}</label>
            <input {...props} />
        </div>
    );
};

export const TextArea = ({className, ...props}) => {

    const style = classnames(
        'border-focus-input-primary',
        inputStyle["input-form"],
        className
    );

    return (
        <div className={style}>
            <label htmlFor={props.id}>{props.label}</label>
            <textarea {...props} />
        </div>
    );
};

export const InputIcon = ({className, icon, ...props}) => {

    const style = classnames(
        'border-focus-input-primary',
        inputStyle["input-form"],
        className
    );

    const styleIcon = classnames(
        inputStyle["img"],
        className
    );

    return (
        <div className={style}>
            <label htmlFor={props.id}>{props.label}</label>
            <input {...props} />
            <div>
                <img className={styleIcon} src={icon} alt=""/>
            </div>
        </div>
    );
};

const styleInputSearch = theme => ({
    root: {
        width: '100%'
    },
    inputRoot: {
        border: 1,
        borderColor: theme.palette.commons.gray3,
        borderStyle: 'solid',
        borderRadius: 20,
        color: theme.palette.commons.fontColor,
        padding: "0 10px",
        fontSize: 16
    },
    input: {
        padding: '7px 0'
    },
    inputFocused: {
        borderColor: theme.palette.primary.main
    }
});

function InputSearch(props) {
    const {classes, classInputRoot, classInput, startAdornment, endAdornment, ...rest} = props;


    return (
        <TextField
            className={classes.root}
            id="input-with-icon-textfield"
            InputProps={{
                disableUnderline: true,
                classes: {
                    root: `${classes.inputRoot} ${classInputRoot}`,
                    input: `${classes.input} ${classInput}`,
                    focused: classes.inputFocused
                },
                startAdornment: startAdornment || (
                    <InputAdornment position="start">
                        <Search/>
                    </InputAdornment>
                ),
                endAdornment: endAdornment || null,
            }}
            InputLabelProps={{
                shrink: true,
            }}
            {...rest}
        />
    )
}

export default withStyles(styleInputSearch)(InputSearch);
