import React from 'react';
import MaskedInput from "react-text-mask";
import createNumberMask from "text-mask-addons/src/createNumberMask";
import InputDefault from './InputDefault';

export const AlturaMask = (props) => {
    const { inputRef, ...other } = props;

    const numberMask = createNumberMask({
        prefix: '',
        suffix: ' cm',
        includeThousandsSeparator: false,
        decimalSymbol: ',',
        integerLimit: 3,
        allowDecimal: true,
        decimalLimit: 1
    });

    return <MaskedInput 
        ref={ref => {
            inputRef(ref ? ref.inputElement : null);
        }}
        placeholderChar={'\u2000'} 
        showMask={props.showmask}
        mask={numberMask}
        {...other}
    />
};

export const InputAltura = (props) => {
    return <InputDefault InputProps={{ inputComponent: AlturaMask }} {...props} />
};
