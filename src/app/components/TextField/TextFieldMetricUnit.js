import React from "react";
import { TextField as TextFieldDefault } from "@material-ui/core";
import MaskedInput from "react-text-mask";
import createNumberMask from "text-mask-addons/src/createNumberMask";
import string from "../../utils/string";

const defaultNumberMaskOptions = {
  prefix: '',
  suffix: '',
  includeThousandsSeparator: false,
  decimalSymbol: ',',
  allowDecimal: true,
};

const renderMaskedInput = (props, numberMask) => {
  const { inputRef, value, ...others } = props;
  
  let valueMask = typeof value === 'number' ? value.toString().replace('.', ',') : value;
  
  return (
    <MaskedInput 
        ref={ref => {
            inputRef(ref ? ref.inputElement : null);
        }} 
        placeholderChar={'\u2000'} 
        showMask={props.showmask}
        mask={numberMask}
        {...others}
        value={valueMask}
    />
  )
}

export const MetricUnitMask = (props) => {
    const numberMask = createNumberMask({
        ...defaultNumberMaskOptions,
        suffix: `${props.unit ? ` ${props.unit}` : ''}`,
    });

    return renderMaskedInput(props, numberMask);
};

const getMaskProps = (props, unit) => {
  const maskProps = {
    ...props,
    InputProps: {
      ...props.InputProps,
      inputComponent: MetricUnitMask,
      inputProps: {
        unit
      }
    }
  }
  
  return maskProps;
};

const handleChangeTextField = (event, props) => {
  if (typeof props.onUnitChange === 'function') {
    const value = event.target.value;
    const data = {
      value: string.numberMaskToFloat(value),
      valueWithMask: value,
    };
    props.onUnitChange(data);
  }
}

const TextFieldMetricUnit = props => {
  const { unit, onUnitChange, ...others } = props;

  return (
    <TextFieldDefault
      variant="outlined"
      fullWidth={false}
      {...others}
      {...getMaskProps(others, unit)}
      onChange={(e) => handleChangeTextField(e, props)}
    />
  );
};

export default TextFieldMetricUnit;
