import React from 'react';
import classnames from "classnames"
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Colors from "../../template/Colors";
import { withStyles } from "@material-ui/core/styles/index";
import Input from "@material-ui/core/Input/Input";

const inputStyle = {
    border: '1px solid ' + Colors.commons.gray3,
    borderRadius: '5px',
    paddingLeft: '8px',
    paddingRight: '8px',
}

const styles = theme => ({
    root: {
        width: '100%',
    },
    rootWithLabel: {
        marginTop: '0 !important',
    },
    label: {
        color: Colors.primary.main,
        lineHeight: '14px',
        transform: 'none',
        transition: 'none',
        position: 'relative',
        fontSize: '1rem',
        paddingLeft: '4px'
    },
    input: {
        ...inputStyle,
        '&:focus': {
            borderColor: Colors.primary.main
        }
    },

    inputError: {
        ...inputStyle,
        border: '1px solid ' + Colors.commons.red,
    },
    inputType: {},
    inputMultiline: {
        paddingTop: '5px',
        paddingBottom: '10px',

        '&:focus': {
            borderColor: Colors.primary.main
        }
    }
});

const InputForm = ({label, className, classes, error, inputRef, alternativeInputeClass, ...props}) => {
    
    const style = classnames(className, className && className.root ? className.root : null);
    const inputStyle = classnames(classes.input, alternativeInputeClass ? alternativeInputeClass : null);
    const inputErrorStyle = classnames(classes.inputError, alternativeInputeClass ? alternativeInputeClass : null);

    return <FormControl className={style} variant="outlined">
        {label ?
            <InputLabel htmlFor={label} className={classes.label}>
                {label}
            </InputLabel>
            : ''
        }
        <Input
            {...props}
            inputRef={inputRef}
            className={classes ? classnames(classes.root, label ? classes.rootWithLabel : null ) : null}
            classes={{
                input: error ? inputErrorStyle : inputStyle,
                inputType: classes.inputType,
                inputMultiline: classes.inputMultiline
            }}
            disableUnderline={true}
        />
    </FormControl>;
};

export default withStyles(styles)(InputForm);
