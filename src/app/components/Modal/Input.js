import InputFormDefault from "../../components/Input/InputForm";
import { InputCPFForm as InputCPFFormDefault } from "../../components/Input/InputCPFForm";
import { InputPhoneForm as InputPhoneFormDefault } from "../../components/Input/InputPhoneForm";
import Colors from "../../template/Colors";
import { withStyles } from "@material-ui/core";
import SelectFormDefault from "../../components/Select/Select";
import InputDateFormDefault from "../../components/Input/InputDateForm";
import InputTimeFormDefault from "../../components/Input/InputTimeForm";

const styleInput = {
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
        paddingLeft: '4px',
        fontFamily: 'Nexa Black!important',
    },
    input: {
        borderBottom: '1px solid ' + Colors.commons.gray6,
        border: 0,
        borderRadius: 0,
        padding: '11px 0 0 0px',
        fontSize: '14px',
        fontFamily: 'Nexa Book!important',
        color: Colors.commons.gray7,
        '&:focus': {
            borderColor: Colors.primary.main
        }
    },
  
    inputError: {
        borderBottom: '1px solid ' + Colors.commons.red,
        border: 0,
        borderRadius: 0,
        padding: '11px 0 0 0px',
        fontSize: '14px',
        color: Colors.commons.gray7,
    },
    inputType: {},
    inputMultiline: {
        fontSize: '14px',
        color: Colors.commons.gray7,
        paddingTop: '5px',
        paddingBottom: '10px',
        border:0,
  
        '&:focus': {
            border:0,
        }
    }
};

const styleDate = {
    input: {
        padding: '4px 0px 0px 22px',
        textAlign: 'center',
        color: Colors.commons.gray7,
        fontFamily: 'Nexa Book!important',
    },
    icon: {
        '& button': {
            padding: 0,
            marginRight: 5,
            width: '24px',
            height: '24px',
            backgroundColor: Colors.primary.main,
            color: Colors.commons.white,
        },

        '& span.material-icons': {
            position: 'absolute',
            marginTop:0,
        },
        '& svg': {
            fontSize: '18px',
        }
    },
    label: {
        color: Colors.commons.secondary,
        fontFamily: 'Nexa Black!important',
        fontWeight: 'bold',
        fontSize: '10px',
        transform: 'none',
        transition: 'none',
        marginTop: 0,
    },
    date: {
        borderWidth: 1,
        border: 0,
        borderRadius: 100,
        fontSize: '14px',
        alignItems: 'center',
        color: Colors.commons.gray7,
        lineHeight: '150%',
        height: '32px',
        backgroundColor: Colors.commons.gray2,
        marginTop: '11px!important'
    },
    dateOutlined: {
        boxSizing: "border-box",
        paddingLeft: 6
    },
    dateWithLabel: {
        marginTop: '11px!important'
    },
    error: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: Colors.commons.red
    }
}

const styleSelect = {
    root: {
        width: '100%',
        
        '&.width-auto': {
            width: 'auto',
        }
    },
    select: {
        fontSize: '14px',
        fontFamily: 'Nexa Book!important',
        border: '0',
        minHeight: '6px',
        height: '18px',
        color: Colors.commons.gray7,
        backgroundColor: Colors.commons.gray2,
        margin: '0 0 0 0',
        padding: '9px 0px 5px 0px',
        borderRadius: '100px',
        textAlign: 'center',

        '&:focus': {
            borderRadius: '100px',
            borderColor: Colors.primary.main,
            color: Colors.commons.gray7,
            backgroundColor: Colors.commons.gray2,
        },


        '& div:focus': {
            backgroundColor: 'transparent',
        },
        
        '&.hide-borders': {
            borderColor: 'transparent',
            paddingRight: 30,
            lineHeight: 'normal'
        },
        
        '&.primary': {
            color: Colors.primary.main
        }
    },
    inputLabel: {
        color: Colors.primary.main,
        lineHeight: '15px',
        transition: 'none',
        transform: 'none',
    },
    menuItem: {
        lineHeight: '17px',
        paddingLeft: '10px',
        paddingRight: '10px',
        paddingTop: '5px',
        color: Colors.commons.fontColor,
        paddingBottom: '5px',
        fontFamily: 'Nexa Book!important'
    },

    itemLabel: {
        paddingRight: '10px',
        color: Colors.commons.fontColor,
        fontFamily: 'Nexa Black!important',
    },

    icon: {
        backgroundColor: Colors.primary.main,
        color: Colors.commons.white,
        top: 'calc(50% - 12px)',
        fontSize: '24px',
        borderRadius: '50%',
        right: 6 
    },
    status: {
        display: 'inline-box',
        marginTop: '1px',
        width: '15px',
        minWidth: '15px',
        height: '15px',
        borderRadius: '50%'
    },
    statusLabel: {
        marginLeft: '5px',
        marginTop: '2px',
        fontFamily: 'Nexa Book!important',
    },
    itemSelectedStatus: {
        display: 'inline-flex',
        alignItems: 'center',
        width: '65%'
    }
  };

const styleTime = {
    input: {
        padding: '4px 0px 0px 22px',
        textAlign: 'center',
        color: Colors.commons.gray7,
        fontFamily: 'Nexa Book!important'
    },
    icon: {
        '& button': {
            padding: 0,
            marginRight: 5,
            width: '24px',
            height: '24px',
            backgroundColor: Colors.primary.main,
            color: Colors.commons.white,

            "&:disabled": {
                backgroundColor: Colors.commons.gray7
            }
        },

        '& span.material-icons': {
            position: 'absolute',
            marginTop:0,
        },
        '& svg': {
            fontSize: '18px',
            fill:  `${Colors.commons.white}!important`
        }
    },
    label: {
        color: Colors.commons.secondary,
        fontWeight: 'bold',
        fontSize: '10px',
        transform: 'none',
        transition: 'none',
        marginTop: 0,
        fontFamily: 'Nexa Black!important',
    },
    date: {
        borderWidth: 1,
        border: 0,
        borderRadius: 100,
        fontSize: '14px',
        alignItems: 'center',
        color: Colors.commons.gray7,
        lineHeight: '150%',
        height: '32px',
        backgroundColor: Colors.commons.gray2,
        marginTop: '11px!important',
        fontFamily: 'Nexa Book!important',
    },
    error: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: Colors.commons.red
    }
};
    
  export const InputForm = withStyles(styleInput)(InputFormDefault);
  
  export const InputPhoneForm = withStyles(styleInput)(InputPhoneFormDefault);

  export const InputCPFForm = withStyles(styleInput)(InputCPFFormDefault);

  export const InputDateForm = withStyles(styleDate)(InputDateFormDefault)

  export const InputTimeForm = withStyles(styleTime)(InputTimeFormDefault)

  export const SelectForm = withStyles(styleSelect)(SelectFormDefault);
