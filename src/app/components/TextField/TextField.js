import React from "react";
import { TextField as TextFieldDefault } from "@material-ui/core";
import { CEPMask } from "../Input/InputCEPForm";
import { CurrencyMask } from "../Input/InputCurrency";

const getCEPMaskProps = props => ({
  ...props,
  InputProps: {
    ...props.InputProps,
    inputComponent: CEPMask
  }
});

const getCurrencyMaskProps = props => ({
  ...props,
  InputProps: {
    ...props.InputProps,
    inputComponent: CurrencyMask
  }
});

const getMaskProps = ({ withCEPMask, withCurrencyMask, ...others }) => {
  if (withCEPMask) {
    return getCEPMaskProps(others);
  }
  
  if (withCurrencyMask) {
    return getCurrencyMaskProps(others);
  }

  return null;
};

const TextField = props => {
  const others = {
    ...props,
  };
  
  /**
   * Remove as propriedades que não são permitidas no TextFied do MaterialUI
   */
  delete others.withCEPMask;
  delete others.withCurrencyMask;

  return (
    <TextFieldDefault
      variant="outlined"
      fullWidth
      {...others}
      {...getMaskProps(props)}
    />
  );
};

export default TextField;
