import {withStyles} from "@material-ui/core";
import React from "react";

import checkboxDefaultStyle from "../assets/jss/components/checkboxDefaultStyle"


const CheckboxDefault = (props) => {
    const {classes, name, label, ...rest} = props;

    return (
        <div className={classes.root}>

            <label className={classes.label}>
                <input className={classes.input} id={name} type="checkbox" {...rest}/>
                {label}
            </label>
        </div>
    )
};

export default withStyles(checkboxDefaultStyle)(CheckboxDefault);