import React from "react";

import Grid from "@material-ui/core/Grid";
import ItemSubMenu from "./ItemSubMenu";
import { withRouter } from "react-router-dom";

class SubMenu extends React.PureComponent {
    render() {
        const { match, location, items } = this.props;

        return (
            <Grid container direction={"column"} wrap={"nowrap"}>
                {items.map(item => (
                    <ItemSubMenu
                        key={item.uri}
                        to={`${match.url}${item.uri}`}
                        title={item.title}
                        location={location}
                    />
                ))}
            </Grid>
        );
    }
}

export default withRouter(SubMenu);
