import React from 'react'
import classNames from 'classnames';
import { withStyles } from "@material-ui/core/styles/index";
import Grid from '@material-ui/core/Grid'


const styles = theme => ({
    root: {
        gridArea: "sidebar-left",
        background: theme.palette.commons.grayLight,
        
        maxWidth: 330
    }

});

class PanelLeft extends React.Component {

    render() {
        const { classes, className } = this.props;

        return (
            <Grid item container direction={"column"} wrap={"nowrap"} className={classNames(classes.root, className)}>
                {this.props.children}
            </Grid>
        )
    }
}

export default withStyles(styles)(PanelLeft)