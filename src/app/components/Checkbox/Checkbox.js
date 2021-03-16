import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { Checkbox } from "@material-ui/core";
import { theme as defaultTheme } from "../../template/Theme";
import colors from "../../template/Colors";

const StyledCheckbox = props => {
  const { color, ...others } = props;

  return (
    <MuiThemeProvider
      theme={
        colors.commons[color]
          ? {
              ...defaultTheme,
              overrides: {
                ...defaultTheme.overrides,
                MuiCheckbox: {
                  root: {
                    padding: 0,
                    margin: '5px 1px 5px 5px',
                    color: `${colors.commons[color]} !important`,
                    "&$checked": {
                      color: `${colors.commons[color]} !important`
                    }
                  }
                }
              }
            }
          : defaultTheme
      }
    >
      <Checkbox {...others} color={colors.commons[color] ? undefined : color} />
    </MuiThemeProvider>
  );
};

export default StyledCheckbox;
