import React from 'react';
import classnames from "classnames"
import itemStyles from "./ItemMenu.scss"
import {Link} from 'react-router-dom'

import {withStyles} from "@material-ui/core/styles/index";
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import { Badge } from '@material-ui/core';

const style = theme => ({
    root: {
        flex: '1 100%',
        maxHeight: '8.8%'
    },

    icon: {
        color: "#fff"
    }
});


const ItemMenu = (props) => {
    const {classes, icon, badgeContent} = props;

    const Icon = icon;

    return (
        <Grid item container alignItems={"center"} justify={"center"} className={classes.root}>
            <Tooltip title={props.title} placement="right">
            {
                props.to ?
                    <Link to={props.to} replace className={classnames(
                        itemStyles["btn-menu"]
                    )}>
                        {badgeContent > 0 && (
                            <Badge color="secondary" badgeContent={badgeContent}>
                                <Icon className={classes.icon}/>
                            </Badge>
                        )}
                        {!badgeContent && <Icon className={classes.icon}/>}
                    </Link> :

                    <div
                        className={classnames(
                            itemStyles["btn-menu"]
                        )}>
                        {badgeContent > 0 && (
                            <Badge color="secondary" badgeContent={badgeContent}>
                                <Icon className={classes.icon}/>
                            </Badge>
                        )}
                        {!badgeContent && <Icon className={classes.icon}/>}
                    </div>

            }
            </Tooltip>
        </Grid>
    )


};

export default withStyles(style)(ItemMenu)