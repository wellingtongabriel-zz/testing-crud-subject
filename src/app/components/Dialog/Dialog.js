import React from 'react';
import DialogModal from '@material-ui/core/Dialog';
import { withStyles } from "@material-ui/core/styles/index";


const styles = (theme) => ({
    root: {
        padding: 0,
    },
    paper: {
        borderRadius: 21,
    }
});

const Dialog = (props) => {
    const { classes, ...other } = props;

    return (
        <DialogModal
            {...props}
        >
            {other.children}
        </DialogModal>
    );

};

export default withStyles(styles)(Dialog)