import React from 'react';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import CloseIcon from '@material-ui/icons/Close';
import {withStyles} from "@material-ui/core/styles/index";
import Colors from "../../template/Colors";

const styles = (theme) => ({
    root: {
        padding: 0,
    },
    title: {
        color: Colors.primary.main
    },
    btnClose: {
        position: 'absolute',
        right: 0,
        padding: '13px 10px'
    },
    btnCloseMini: {
        minHeight: 26,
        height: 32,
        width: 32,
        boxShadow: 'none',
        backgroundColor: Colors.commons.white,
        color: Colors.commons.secondary
    }
});

const DialogHeader = (props) => {
    const {classes, closeButton, actionClose} = props;

    return (
        <Grid item xs={12} container wrap={"nowrap"}>
            {closeButton ?
                <div className={classes.btnClose}>
                    <Fab
                        onClick={actionClose}
                        classes={{
                            sizeSmall: classes.btnCloseMini,
                            extendedFab: classes.extendedFab
                        }} size="small" color="primary" aria-label="close">
                        <CloseIcon/>
                    </Fab>
                </div>
                :
                <div/>
            }
        </Grid>
    );

};

export default withStyles(styles)(DialogHeader)
