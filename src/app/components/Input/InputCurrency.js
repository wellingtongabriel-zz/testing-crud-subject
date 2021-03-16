import React from "react";
import MaskedInput from "react-text-mask";
import createNumberMask from "text-mask-addons/src/createNumberMask";
import InputDefault from "./InputDefault";

export const CurrencyMask = props => {
  const { inputRef, ...other } = props;

  const numberMask = createNumberMask({
    prefix: "R$ ",
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ",",
    allowDecimal: true,
  });

  return (
    <MaskedInput
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      placeholderChar={"\u2000"}
      showMask={props.showmask}
      mask={numberMask}
      {...other}
    />
  );
};

export const InputCurrency = props => {
  return (
    <InputDefault InputProps={{ inputComponent: CurrencyMask }} {...props} />
  );
};
