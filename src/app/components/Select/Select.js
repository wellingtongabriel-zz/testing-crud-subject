import React from 'react';
import classNames from 'classnames';
import { InputLabel, MenuItem, Select } from '@material-ui/core';
import Colors from "../../template/Colors";
import FormControl from "@material-ui/core/FormControl/FormControl";
import { withStyles } from "@material-ui/core/styles/index";
import colors from '../../template/Colors';


const style = theme => ({
    root: {
        width: '100%',
        
        '&.width-auto': {
            width: 'auto',
        }
    },
    select: {
        fontSize: '14px',
        padding: '7px 0 7px 0',
        border: '1px solid',
        borderColor: 'rgba(105, 105, 105, 0.7)',
        borderRadius: '10px',
        paddingLeft: '8px',
        lineHeight: '15px',

        '&:focus': {
            borderRadius: '10px',
            backgroundColor: theme.palette.commons.white,
            borderColor: Colors.primary.main
        },


        '& div:focus': {
            backgroundColor: 'transparent',
        },
        
        '&.hide-borders': {
            borderColor: 'transparent',
            paddingRight: 30,
            lineHeight: 'normal'
        },
        
        '&.primary': {
            color: colors.primary.main
        }
    },
    inputLabel: {
        color: Colors.primary.main,
        lineHeight: '15px',
        transition: 'none',
        transform: 'none',
    },
    menuItem: {
        lineHeight: '17px',
        paddingLeft: '10px',
        paddingRight: '10px',
        paddingTop: '5px',
        color: Colors.commons.fontColor,
        paddingBottom: '5px'
    },

    itemLabel: {
        paddingRight: '10px',
        color: Colors.commons.fontColor
    },

    icon: {
        backgroundColor: Colors.primary.main,
        color: Colors.commons.white,
        top: 'calc(50% - 8px)',
        fontSize: '16px',
        borderRadius: '50%',
        right: 8
    },
    status: {
        display: 'inline-box',
        marginTop: '1px',
        width: '15px',
        minWidth: '15px',
        height: '15px',
        borderRadius: '50%'
    },
    statusLabel: {
        marginLeft: '35px'
    },
    itemSelectedStatus: {
        display: 'inline-flex',
        alignItems: 'center',
        width: '65%'
    }
});

export const SelectForm = props => {
    const {classes, elements, allowEmpty, labelOption, hideBorders, selectedItemColor, formControlProps, ...other} = props;

    return <FormControl {...formControlProps} 
                        className={classNames(classes.root, hideBorders ? 'width-auto' : null, formControlProps.className)}
            >
        {!props.label ? null :
            <InputLabel
                disableAnimation={true}
                classes={{ root: classes.inputLabel }}
                htmlFor={props.name}>
                {props.label}
            </InputLabel>
        }

        <Select
            {...other}
            disableUnderline={true}
            classes={{
                root: classNames(classes.root, hideBorders ? 'width-auto' : null),
                selectMenu: classNames(
                    classes.select, 
                    hideBorders ? 'hide-borders' : null,
                    selectedItemColor ? selectedItemColor : null,
                )
            }}
            IconComponent={props =>
                <i {...props} className={`material-icons ${props.className} ${classes.icon}`}>
                    arrow_drop_down
                </i>
            }
            inputProps={{
                name: props.name,
                id: props.id,
            }}>
            {!allowEmpty ? null :
                <MenuItem className={classes.menuItem} key={"none"} value="" />
            }

            {
             !props.labelOption ? null :
                <MenuItem className={classes.menuItem} key={"none"} value="none" disabled={true} >
                    {props.labelOption}
                </MenuItem>
            }

            {elements.map(item =>
                <MenuItem className={classes.menuItem} key={item.value} value={item.value}>
                    {!item.cor ? item.name :
                        <div className={classes.itemSelectedStatus}>
                            <div className={classes.status} style={{backgroundColor: Colors.commons[item.cor]}} />
                            <div className={classes.statusLabel}>{item.name}</div>
                        </div>
                    }
                </MenuItem>
            )}
        </Select>
    </FormControl>
};

SelectForm.defaultProps = {
    value: '',
    hideBorders: false,
    selectedItemColor: null,
    formControlProps: {
        className: null,
    }
};

export default withStyles(style)(SelectForm);
