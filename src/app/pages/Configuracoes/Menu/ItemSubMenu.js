import React from "react";
import { Link } from "react-router-dom";
import colors from "../../../template/Colors";

import { withStyles } from "@material-ui/core/styles/index";
import classNames from "classnames";
import Grid from "@material-ui/core/Grid";

const style = () => ({
  root: {
    fontFamily: ["Nexa"],
    fontSize: "1em"
  },

  item: {
    display: "flex",
    height: "100%",
    width: "100%",
    color: colors.commons.fontColor,
    paddingTop: "15px",
    paddingBottom: "15px",
    paddingLeft: "15%",
    textDecoration: "none",
    boxSizing: "border-box"
  },

  selected: {
    backgroundColor: colors.commons.gray
  }
});

const ItemSubMenu = props => {
  const { classes, title, to, location } = props;
  
  const selected = location.pathname === to;

  const className = classNames(classes.item, {
    [classes.selected]: selected
  });

  return (
    <Grid item container className={classes.root}>
      <Link to={to} className={className}>
        {title}
      </Link>
    </Grid>
  );
};

export default withStyles(style)(ItemSubMenu);
