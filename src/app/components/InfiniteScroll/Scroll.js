import React from 'react'
import classnames from 'classnames';
import { withStyles } from "@material-ui/core/styles/index";
import InfiniteScroll from 'react-infinite-scroller';
import { CircularProgress } from '@material-ui/core';

const styles = () => ({
    root: {
        width: '100%',
        overflowY: 'auto',
        maxHeight: "100%"
    },
    loader: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
        marginBottom: 30
    }
});

class Scroll extends React.Component {

    render() {
        const { classes, rootRef, isLoading, className, ...other } = this.props;

        return (

            <div ref={rootRef} className={classnames(classes.root, className)}>
                <InfiniteScroll
                    loader={isLoading ? <div className={classes.loader} key={0}><CircularProgress color="primary" size={24} /></div> : null}
                    useWindow={false}
                    threshold={250}
                    {...other}
                >
                    {other.children}
                </InfiniteScroll>
            </div>
        )
    }

}

export default withStyles(styles)(Scroll)
