import React from 'react';
import InputForm from "./InputForm";
import MaskedInput from "react-text-mask";
import string from "../../utils/string";

export const RegexMaskPhone = () => [
    '(',
    /\d/, /\d/,
    ')', ' ',
    /\d/, /\d/, /\d/, /\d/,
    '-',
    /\d/, /\d/, /\d/, /\d/, /\d/
];

export const PhoneMask = (props) => {
    const { inputRef, ...other } = props;

    const cellphoneMask = [
        '(',
        /\d/, /\d/,
        ')', ' ',
        /\d/, /\d/, /\d/, /\d/, /\d/,
        '-',
        /\d/, /\d/, /\d/, /\d/];

    let value = string.removeSpecialChars(props.value);
    return <MaskedInput  
        ref={ref => {
            inputRef(ref ? ref.inputElement : null);
        }}
        placeholderChar={'\u2000'} 
        showMask={props.showmask}
        mask={value?.length < 11 ? RegexMaskPhone() : cellphoneMask}
        {...other}
    />
};

export const InputPhoneForm = ({...props}) => {
    return <InputForm inputComponent={PhoneMask} {...props} onClick={(e) => {
        if (string.removeSpecialChars(e.target.value).length === 0)
            e.target.setSelectionRange(0, 0);
    }}/>
};
