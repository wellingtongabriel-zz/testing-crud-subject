import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import {DatePicker} from 'material-ui-pickers';
import {withStyles} from "@material-ui/core";
import Colors from "../../template/Colors";
import string from "../../utils/string";

const style = theme => ({
    input: {
        paddingTop: 11
    },
    icon: {
        '& button': {
            width: 30,
            height: 30,
            padding: 0,
        },

        '& span.material-icons': {
            fontSize: '1.8em',
            color: Colors.primary.main,
            position: 'absolute',
            marginTop:0
        }
    },
    label: {
        color: theme.palette.primary.main,
        fontSize: '0.9em',
        transform: 'none',
        transition: 'none',
        marginTop: 4,
    },
    date: {
        height: 31,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.palette.commons.gray3,
        borderRadius: 5,
        fontSize: '14px',
        alignItems: 'center',
        color: theme.palette.commons.fontColor
    },
    dateOutlined: {
        boxSizing: "border-box",
        paddingLeft: 6
    },
    dateWithLabel: {
        marginTop: '18px !important',
    },
    error: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.palette.commons.red
    }
});

const handleInputChange = (e, props) => {
    const { onChange } = props;
    if(typeof onChange !== 'function') {
        return;
    }
    const text = string.removeSpecialChars(e.target.value);
    
    if(typeof text === 'string' && text.trim().length === 0) {
        return onChange(null);
    }
    
    if(typeof text === 'string' && text.trim().length === 8) {
        const date = moment(text, 'DDMMYYYY');
        
        if(!date.isValid()) {
            return;
        }

        if(date.year() > 2100 || date.year() < 1900) {
            return;
        }
       
        return onChange(moment(text, 'DDMMYYYY'));
    }
}

const InputDateForm = ({classes, ...props}) => {
    if(props.value === '')
        props.value = null;
        
    let classesRoot = props.label ? classnames(classes.date, classes.dateWithLabel) : classes.date;
    let classesInput = classes.input;
    let classesError = classes.error;
    let inputProps = {
        disableUnderline: true
    };
    
    if(props.variant === "outlined") {
        classesRoot = classes.dateOutlined;
        classesInput = null;
        classesError = null;
        inputProps = {};
    }
    
    return <DatePicker
               disabled={props.disabled || false}
               adornmentPosition={props.iconPosition || "start"}
               cancelLabel={"Cancelar"}
               invalidDateMessage="Insira uma data válida"
               minDateMessage="Insira uma data válida"
               maxDateMessage="Insira uma data válida"
               placeholder={"__/__/____"}
               format={"DD/MM/YYYY"}
               mask={value => (value ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : [])}
               keyboard
               disableOpenOnEnter
               InputProps={{
                   classes: {
                       root: classesRoot,
                       input: classesInput,
                       error: classesError
                   },
                   ...inputProps
               }}

               InputLabelProps={{
                   classes: {
                       root: classes.label
                   },
               }}

               InputAdornmentProps={{
                   classes: {
                       root: classes.icon
                   }
               }}
               onInputChange={(e) => handleInputChange(e, props)}
               {...props}/>
};


export default withStyles(style)(InputDateForm);
