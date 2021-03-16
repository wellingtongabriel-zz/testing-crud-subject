import React from 'react';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import colors from './Colors';

export const theme = createMuiTheme({
    palette: {
        primary: colors.primary,
        danger: colors.commons.red,
        error: colors.error,
        contrastThreshold: 3,
        tonalOffset: .2,
        // type: 'dark',
        commons: colors.commons
    },
    typography: {
        useNextVariants: true,
        fontFamily: [
            'Nexa', 'Nexa Book', 'Nexa Black', 'Nexa Bold', 'Nexa Light'
        ],
        caption: {
            color: colors.commons.fontColor
        }
    },
    overrides: {
        MuiInputBase: {
            input: {
                color: colors.commons.fontColor
            }
        },
        MuiInputLabel: {
            outlined: {
                zIndex: 'auto', // default 1
                transform: 'translate(10px, 9px) scale(1)',
                color: colors.commons.placeholderColor
            }
        },
        MuiOutlinedInput: {
            input: {
                padding: '8px 13px 7px',
            },
            notchedOutline: {
                borderColor: `${colors.commons.gray3}`,
                borderRadius: 10,
            },
        },
        MuiCheckbox: {
            root: {
                padding: 0,
                margin: '0 5px 0 0',
                color: colors.commons.fontColor
            }
        },
        MuiTypography: {
            root: {
                color: colors.commons.fontColor, 
            },
            h6: {
                color: colors.commons.fontColor, 
            },
            body2: {
                color: colors.commons.fontColor,
                lineHeight: 'normal',
            }
        },
        MuiBadge: {
            badge: {
                fontSize: '12px !important',
            }
        },
        MuiSlider: {
            track: { backgroundColor: colors.commons.white },
            thumb: { backgroundColor: colors.commons.white },
            active: { backgroundColor: colors.commons.white },
        },
    },

    commons: {
        menuLeft: {
            width: '20%'
        },
        marginContainer: {
            top: '1.45%',
            topPx: '17px',
            right: '3%',
            bottom: '1.9%',
            left: '2.3%',
        }
    }
});


const Theme = (props) => {
    return (
        <MuiThemeProvider theme={theme}>
            {props.children}
        </MuiThemeProvider>
    );
};

export default Theme;
