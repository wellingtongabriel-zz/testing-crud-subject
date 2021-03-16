import React from 'react';
import MaskedInput from "react-text-mask";
import createNumberMask from "text-mask-addons/src/createNumberMask";
import InputDefault from './InputDefault';

export const PesoMask = (props) => {
    const { inputRef, ...other } = props;

    const numberMask = createNumberMask({
        prefix: '',
        suffix: ' kg',
        includeThousandsSeparator: false,
        decimalSymbol: ',',
        integerLimit: 3,
        allowDecimal: true,
        decimalLimit: 3
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

export const InputPeso = (props) => {
    return <InputDefault InputProps={{ inputComponent: PesoMask }} {...props} />
};
