import React from 'react';
import {withStyles} from "@material-ui/core/styles/index";


const styles = (theme) => ({
    root: {
        padding: 0,
        width: '100%',
        textAlign: 'center'
    },
    title: {
        fontSize: '1.5rem',
        color: theme.palette.primary.main
    }
});

const DialogTitle = (props) => {
    const {classes, children} = props;

    return (
        <div className={classes.root}>
            <h2 className={classes.title}>
                {children}
            </h2>
        </div>
    );

};

export default withStyles(styles)(DialogTitle)