import React from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core";
import string from "../../utils/string";

const styles = theme => ({
    root: {
        userSelect: "none",
        width: "1em",
        height: "1em",
        display: "inline-block",
        fill: "currentColor",
        flexShrink: 0,
        fontSize: 22,
        transition: theme.transitions.create("fill", {
            duration: theme.transitions.duration.shorter
        })
    },
    colorPrimary: {
        color: theme.palette.primary.main
    },
    colorSecondary: {
        color: theme.palette.commons.gray4
    },
    cls1: {},
    cls2: {
        fill: "#00c1bf"
    },
    cls3: {
        fontSize: 9,
        fontFamily: "Nexa, Helvetica-Bold, Helvetica",
        fontWeight: 700
    }
});

const Financeiro = ({ classes, color, className, ...others }) => {
    const colorClass =
        typeof color === "string"
            ? classes[`color${string.capitalize(color)}`]
            : null;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 14.693 26"
            className={classNames(classes.root, colorClass, className)}
            {...others}
        >
            <path
                d="M7.922,11.443a21.173,21.173,0,0,1,2.471.813,12.544,12.544,0,0,1,2.065,1.117,4.849,4.849,0,0,1,1.659,1.794,5.412,5.412,0,0,1,.576,2.573A4.507,4.507,0,0,1,13.3,21.159a6.962,6.962,0,0,1-3.69,1.727V26H5.281V22.885a7.32,7.32,0,0,1-3.69-1.9A5.368,5.368,0,0,1,0,17.333H3.182q.271,3.047,4.266,3.047a4.64,4.64,0,0,0,3.013-.779,2.309,2.309,0,0,0,.914-1.794q0-2.438-4.333-3.521Q.271,12.729.271,8.328A4.513,4.513,0,0,1,1.693,4.977,7.218,7.218,0,0,1,5.281,3.115V0H9.615V3.182a6.008,6.008,0,0,1,3.419,2.031,5.718,5.718,0,0,1,1.253,3.453H11.1Q10.969,5.62,7.448,5.62a4.764,4.764,0,0,0-2.81.745A2.3,2.3,0,0,0,3.589,8.328Q3.589,10.292,7.922,11.443Z"
                transform="translate(0)"
            />
        </svg>
    );
};

export default withStyles(styles)(Financeiro);
