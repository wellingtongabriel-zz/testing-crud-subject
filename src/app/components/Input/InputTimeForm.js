import React from 'react';
import {TimePicker} from "material-ui-pickers";
import {withStyles} from "@material-ui/core";
import Timer from '@material-ui/icons/Timer';
import Colors from "../../template/Colors";

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
        alignItems: 'center',
        marginTop: '18px !important',
        color: theme.palette.commons.fontColor
    },
    error: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.palette.commons.red
    }
});

const InputTimeForm = ({classes, ...props}) => {
    return <TimePicker adornmentPosition={props.iconPosition || "start"}
                       cancelLabel={"Cancelar"}
                       placeholder={"hh:mm"}
                       format={"HH:mm"}
                       mask={value => (value ? [/\d/, /\d/, ':', /\d/, /\d/] : [])}
                       keyboard
                       keyboardIcon={<Timer />}
                       disableOpenOnEnter
                       ampm={false}

                       InputProps={{
                           classes: {
                               root: classes.date,
                               input: classes.input,
                               error: classes.error
                           },
                           disableUnderline: true
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

                       {...props}/>
};


export default withStyles(style)(InputTimeForm);
