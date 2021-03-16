import React from 'react'

import {withStyles} from '@material-ui/core/styles';
import GracefulImage from '../Image/GracefulImage';
const profileDefault = require("../../assets/img/svg/img-profile-default.svg");


const styles = theme => ({

    root: {
        height: "100% ",
        display: 'flex',
        alignItems: 'center'
    },

    userInfo: {
        fontSize: 16,
    },

    userImage: {
        marginLeft: 20,
        height: 60,
        width: 60,
        borderRadius: 50
    },

    userImageDefault: {
        marginLeft: 20,
        height: 50,
        width: 50,
        background: theme.palette.commons.gray,
        borderRadius: 50

    }

});

function LogoImage(props) {
    const {classes, ...other} = props;

    return (
        <div className={classes.root}>
            <div className={classes.userInfo}>
                <p>{other.text}</p>
            </div>

            { 
                other.image
                ?
                <GracefulImage className={classes.userImage} src={other.image || profileDefault} alt={other.text} placeholderColor={'#00ACA9'} />
                :
                <div className={classes.userImageDefault} />
            }
        </div>
    )
}

export default withStyles(styles)(LogoImage)