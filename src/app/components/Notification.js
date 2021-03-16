import React from 'react'
import PropTypes from 'prop-types';

import {withStyles} from "@material-ui/core/styles/index";
import {SnackbarContent, IconButton, Snackbar} from '@material-ui/core'

import WarningIcon from '@material-ui/icons/Warning';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close'

import classNames from 'classnames'

NotificationContent.propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    message: PropTypes.node,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(['success', 'warning', 'error', 'info', '']).isRequired,
};

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

const styles1 = theme => ({
    success: {
        backgroundColor: theme.palette.primary.light,
    },
    error: {
        backgroundColor: theme.palette.commons.red,
    },
    info: {
        backgroundColor: theme.palette.commons.blue,
    },
    warning: {
        backgroundColor: theme.palette.commons.yellow,
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
});


function NotificationContent(props) {
    const {classes, className, message, onClose, variant, ...other} = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={classNames(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
                    {(variant && <Icon className={classNames(classes.icon, classes.iconVariant)}/>) || null}

                    {message}
        </span>
            }
            action={[
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    className={classes.close}
                    onClick={onClose}
                >
                    <CloseIcon className={classes.icon}/>
                </IconButton>,
            ]}
            {...other}
        />
    );
}

const NotificationContentWrapper = withStyles(styles1)(NotificationContent);

function Notification({close, reset, isOpen, message, variant}) {

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isOpen}
            onClose={close}
            onExited={reset}
        >
            <NotificationContentWrapper
                onClose={close}
                variant={variant}
                message={message}
            />
        </Snackbar>
    )
}

export default Notification;