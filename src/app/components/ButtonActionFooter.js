import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {Button} from '@material-ui/core';
import Colors from "../template/Colors";


const styles = theme => ({
    root: {
        // backgroundColor: 'transparent',
        // boxShadow: null
    },

    label: {
        display: 'flex',
        flexDirection: 'column',
        color: Colors.commons.white,
    },

    icon: {
        fontSize: "3.5vh",
        [theme.breakpoints.up('xl')]: {
            fontSize: "3.5vh !important",
        },
        display: 'flex',
        flexDirection: 'column',
    },
    span: {
        fontSize: "1.3vh !important",
        [theme.breakpoints.up('xl')]: {
            fontSize: "1.3vh !important",
        },
    }
});

class ButtonActionFooter extends React.Component {
    state = {
        value: 0,
    };


    render() {
        const {classes, label, icon} = this.props;

        const IconComponent = icon || null;

        return (
            <Button classes={{
                root: classes.root,
                label: classes.label
            }} onClick={this.props.onClick}>
                <IconComponent className={classes.icon}/>
                <span>{label}</span>
            </Button>
        );
    }
}

ButtonActionFooter.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonActionFooter);