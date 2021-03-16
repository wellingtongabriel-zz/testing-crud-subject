import React from "react";
import InputForm from "./InputForm";
import MaskedInput from "react-text-mask";
import string from "../../utils/string";

export const CEPMask = props => {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      placeholderChar={"\u2000"}
      showMask={props.showmask}
      mask={[/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/]}
      {...other}
    />
  );
};

export const InputCEPForm = ({ ...props }) => {
  return (
    <InputForm
      {...props}
      inputComponent={CEPMask}
      onClick={e => {
        if (string.removeSpecialChars(e.target.value).length === 0)
          e.target.setSelectionRange(0, 0);
      }}
    />
  );
};
