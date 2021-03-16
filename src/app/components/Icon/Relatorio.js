import React from "react";
import classNames from "classnames";
import {withStyles} from "@material-ui/core";
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

const Relatorio = ({classes, color, className, ...others}) => {
    const colorClass =
        typeof color === "string"
            ? classes[`color${string.capitalize(color)}`]
            : null;

    return (

        <svg width="48"
             height="50"
             viewBox="0 0 48 50"
             fill="none"
             className={classNames(classes.root, colorClass, className)}
             xmlns="http://www.w3.org/2000/svg"
             {...others}
        >
            <path
                d="M8.27586 13.3333V3.33333C8.27586 2.39583 8.59482 1.60591 9.23276 0.963542C9.87069 0.321177 10.6552 0 11.5862 0H36.4138C37.3448 0 38.1293 0.321177 38.7672 0.963542C39.4052 1.60591 39.7241 2.39583 39.7241 3.33333V13.3333H8.27586ZM6.62069 40H4.96552C3.5862 40 2.4138 39.5139 1.44828 38.5417C0.482754 37.5694 0 36.3889 0 35V20C0 18.6111 0.482754 17.4306 1.44828 16.4583C2.4138 15.4861 3.5862 15 4.96552 15H43.0345C44.4138 15 45.5862 15.4861 46.5517 16.4583C47.5172 17.4306 48 18.6111 48 20V35C48 36.3889 47.5172 37.5694 46.5517 38.5417C45.5862 39.5139 44.4138 40 43.0345 40H41.3793V31.6667H6.62069V40ZM8.27586 33.3333H39.7241V46.6667C39.7241 47.6042 39.4052 48.3941 38.7672 49.0365C38.1293 49.6788 37.3448 50 36.4138 50H11.5862C10.6552 50 9.87069 49.6788 9.23276 49.0365C8.59482 48.3941 8.27586 47.6042 8.27586 46.6667V33.3333ZM38.069 25C38.5172 25 38.9052 24.8351 39.2328 24.5052C39.5603 24.1753 39.7241 23.7847 39.7241 23.3333C39.7241 22.8819 39.5603 22.4913 39.2328 22.1615C38.9052 21.8316 38.5172 21.6667 38.069 21.6667C37.6207 21.6667 37.2328 21.8316 36.9052 22.1615C36.5776 22.4913 36.4138 22.8819 36.4138 23.3333C36.4138 23.7847 36.5776 24.1753 36.9052 24.5052C37.2328 24.8351 37.6207 25 38.069 25ZM11.5862 38.3333V40H36.4138V38.3333H11.5862ZM11.5862 43.3333V45H36.4138V43.3333H11.5862Z"
                fill="white"/>
        </svg>

    );
};

export default withStyles(styles)(Relatorio);