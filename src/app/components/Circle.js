import React from "react"
import {withStyles} from "@material-ui/core/styles/index";
import classnames from 'classnames'
import {blue, primaryColor, purple, red, yellow, grayLight} from "../assets/jss/appHealth.style";
import PropTypes from "prop-types";

const circleStyle = {
    circle: {
        height: "20px",
        width: "20px",
        borderRadius: "100%",
        backgroundColor: grayLight
    },

    active: {
        border: '2px solid #ffffff',
        boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.16)'
    },
    
    btn: {
        cursor: 'pointer'
    },
    
    primary: {
        backgroundColor: primaryColor,
    },

    purple: {
        backgroundColor: purple,
    },

    blue: {
        backgroundColor: blue,
    },

    yellow: {
        backgroundColor: yellow,
    },

    red: {
        backgroundColor: red,
    }

};

class Circle extends React.Component {
    render() {
        const { classes, color, isButton, active, ...other } = this.props;

        const className = classnames(
            classes.circle,
            color && classes[color],
            isButton ? classes.btn : null,
            active ? classes.active : null
        );

        return (
            <div {...other} className={className} />
        )
    }
}

Circle.propTypes = {
    classes: PropTypes.object.isRequired,
    color: PropTypes.oneOf([
        "primary",
        "red",
        "purple",
        "yellow",
        "blue"
    ]),
    isButton: PropTypes.bool,
    active: PropTypes.bool,
    onClick: PropTypes.func,
};

export default withStyles(circleStyle)(Circle)