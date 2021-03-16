import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {Button} from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';


const styles = theme => ({
    root: {
        position: 'absolute',
        bottom: '21px',
        right: '49px'
    },

    icon: {
        fontSize: "3.5vh",
        [theme.breakpoints.up('xl')]: {
            fontSize: "3.5vh !important",
        },
        display: 'flex',
        flexDirection: 'column',
        width: 52,
        height: 32,
    }
});

class ButtonActionToolTipFooter extends React.Component {

    render() {
        const {classes, label, image} = this.props;

        const ImageComponent = image || null;

        return (
            <Tooltip title={label} placement="top">
                <Button classes={{
                    root: classes.root
                }} 
                    onClick={this.props.onClick}>
                    <img className={classes.icon} src={ImageComponent} alt={label} />
                </Button>
            </Tooltip>  
        );
    }
}

ButtonActionToolTipFooter.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonActionToolTipFooter);