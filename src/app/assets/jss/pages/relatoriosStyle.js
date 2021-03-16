import { gridContainer } from "../appHealth.style"

const styles = theme => ({
    root: {
        ...gridContainer,
        overflow: "hidden",
    },

    rootWithoutSidebar: {
        display: "block"
    },

    panelLeft: {
        padding: 0,
    },

    titleHeader: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: theme.palette.primary.main
    },

    footer: {
        gridArea: "footer",
        paddingLeft: 15,
        paddingRight: 45,
    },
});

export default styles;
