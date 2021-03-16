import React from 'react'

import {withStyles} from '@material-ui/core/styles';

import styles from './Footer.style'


class Footer extends React.Component {

    render() {
        const {classes, ...other} = this.props;
        const className = [
            classes.root,
            this.props.className
        ].join(' ');

        return (
            <div className={className}>
                {other.children}
            </div>
        );
    }
}


export default withStyles(styles)(Footer);