import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { capitalize } from "@material-ui/core/utils/helpers";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";

const styles = theme => ({
  speedDial: {
    position: "absolute",
    "&$directionUp, &$directionLeft": {
      bottom: "3.4vh",
      right: "9vw"
    },
    "&$directionDown, &$directionRight": {
      top: theme.spacing.unit * 2,
      left: theme.spacing.unit * 3
    }
  },
  directionUp: {},
  directionRight: {},
  directionDown: {},
  directionLeft: {}
});

class SpeedDials extends React.PureComponent {
  state = {
    direction: "up",
    openDial: false,
    hidden: false
  };

  handleClick = () => {
    // this.setState(state => ({
    //   openDial: !state.openDial
    // }));
  };
  
  handleClickAction = action => {
    this.setState(() => ({
      openDial: false
    }), () => {
        const { onClickAction } = this.props;

        if (typeof onClickAction === "function") {
            onClickAction(action);
        }
    });
  };

  handleDirectionChange = (event, value) => {
    this.setState({
      direction: value
    });
  };

  handleClose = () => {
    this.setState({ openDial: false });
  };

  handleOpen = () => {
    this.setState({ openDial: true });
  };

  render() {
    const { classes, actions } = this.props;
    const { direction, hidden, openDial } = this.state;

    const speedDialClassName = classNames(
      classes.speedDial,
      classes[`direction${capitalize(direction)}`]
    );

    return (
      <SpeedDial
        ariaLabel="SpeedDial"
        className={speedDialClassName}
        hidden={hidden}
        icon={<SpeedDialIcon />}
        onBlur={this.handleClose}
        onClick={this.handleClick}
        onClose={this.handleClose}
        onFocus={this.handleOpen}
        onMouseEnter={this.handleOpen}
        onMouseLeave={this.handleClose}
        open={openDial}
        direction={direction}
      >
        {actions.map(action => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => this.handleClickAction(action)}
            tooltipOpen
            classes={{
                button: action.buttonClasses || null
            }}
          />
        ))}
      </SpeedDial>
    );
  }
}

SpeedDials.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.array.isRequired
};

export default withStyles(styles)(SpeedDials);
