import React from 'react';

import {withStyles} from '@material-ui/core/styles';
import styled from 'styled-components';

const HeaderComponent = styled.div`
    display: flex;
    align-items: center;
    height: 11.94vh;
    padding: ${props => props.padding ? '0 4% 0 2%' : 0};
`;


const styles = theme => ({
    root: {
        marginTop: theme.commons.marginContainer.topPx,
    }
});


function Header(props) {
    const {classes, ...other} = props;

    return (
        <HeaderComponent className={classes.root} {...other}>
            {other.children}
        </HeaderComponent>
    )

}

export default withStyles(styles)(Header)