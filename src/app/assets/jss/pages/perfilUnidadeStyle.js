import {gridContainer} from "../appHealth.style";

const styles = theme => ({
    root: {
        ...gridContainer,
        overflow: "hidden"
    },

    content: {
        gridArea: "content",
        display: "grid",
        gridTemplateRows: 'auto 1fr',
        position: 'relative',
        overflow: "hidden"
    },


    inputError: {
        border: '1px solid ' + theme.palette.commons.red
    },

    headerTitleRoot: {
        maxWidth: theme.commons.menuLeft.width,
        margin: '0 5%'
    },

    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flexGrow: 1
    },

    leftSpace: {
        padding: '10px'
    },

    titleHeader: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: theme.palette.primary.main
    },

    tableContainer: {
        display: "grid",
        gridRowGap: "24px",
        alignContent: "start",
        overflowY: 'auto',
        padding: `
                15px 
                ${theme.commons.marginContainer.right} 
                0
                ${theme.commons.marginContainer.left}
        `
    },

    radioButtonGroupContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },

    radioButtonGroupLabel: {
        margin: 0
    },

    radioButton: {
        margin: '0 0 0 10px'
    },

    inputWithCheckbox: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },

    formControlLabelCheckbox: {
        marginTop: 5,
    },

    input: {
        width: "100%"
    },

    footer: {
        gridArea: "footer",
        paddingLeft: 15,
        paddingRight: 45,
        display: "flex"
    }
});

export default styles;