import { conformToMask } from "react-text-mask";
import createNumberMask from "text-mask-addons/src/createNumberMask";

export const applyCurrencyMask = number => {
  const parseNumber = parseFloat(number || 0).toFixed(2).replace('.', ',');
  
  const mask = createNumberMask({
    prefix: "R$ ",
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ",",
    allowDecimal: true,
    allowNegative: true
  });

  const conformedNumber = conformToMask(parseNumber, mask, {
    guide: false
  });

  return conformedNumber.conformedValue;
};
