import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Zoom from '@material-ui/core/Zoom';
import AddIcon from '@material-ui/icons/Add';
import Fab from "@material-ui/core/Fab";


const styles = theme => ({
    fab: {
        position: 'absolute',
        bottom: '3.4vh',
        right: '9vw',
    },
});

class FloatingActionButtonZoom extends React.Component {
    state = {
        value: 0,
    };


    render() {
        const {classes, theme} = this.props;
        const transitionDuration = {
            enter: theme.transitions.duration.enteringScreen,
            exit: theme.transitions.duration.leavingScreen,
        };

        const Icon = this.props.icon;

        return (
            <Zoom
                in={true}
                timeout={transitionDuration}
                unmountOnExit
            >
                <Fab onClick={this.props.onClick} className={classes.fab} color={'primary'}>
                    {this.props.icon ? <Icon /> : <AddIcon/>}
                </Fab>
            </Zoom>
        );
    }
}

FloatingActionButtonZoom.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(FloatingActionButtonZoom);
