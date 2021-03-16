import Colors from "../../../template/Colors";

const styles = () => ({
    root: {
        display: "block",
        error: {
            border: 0
        }
    },
    spaceRight: {

        paddingRight: "10px",
        lineHeight: '15px'
    },
    spaceRightSelect: {
        paddingRight: "10px",
        paddingLeft: "2px"
    },
    spaceLeftSelect: {
        paddingLeft: "2px"
    },
    spaceTop: {
        paddingTop: "3px"
    },
    spaceTopButtons: {
        paddingTop: "10px"
    },
    inlineButtonLast: {
        display: "inline-flex",
        width: "100%",
        maxWidth: "28%",
        rigth: '0'
    },
    inlineButtonLastIsStatusBloqueado: {
        display: "inline-flex",
        width: "100%",
        maxWidth: "29.5%"
    },
    inlineButtons: {
        display: "inline-flex",
        width: "100%",
        paddingBottom: '20px'
    },
    modalContent: {
        width: "520px",
        overflowY: 'unset',
    },
    modalArrow: {
        height: "35px",
        marginTop: "10px",
        paddingLeft: "30px",
        cursor: "pointer"
    },
    gridFather: {
        display: "flex",
        overflowY: 'unset',
    },
    gridFlex: {
        flex: 10
    },
    gridFlexExpanded: {
        marginLeft: "40px",
        paddingLeft: "15px",
        flex: 9
    },
    gridDivider: {
        borderLeft: "1px solid " + Colors.commons.gray3,
        height: "70%",
        position: "absolute",
        top: "90px",
        left: "580px"
    },
    paperListTitle: {
        flexBasis: "18%"
    },
    paperList: {
        maxHeight: "335px",
        overflow: "auto",
        boxShadow: "none"
    },
    listPadding: {
        paddingRight: "16px"
    },
    listItemMargin: {
        marginBottom: "0px"
    },
    listItem: {
        border: "1px solid " + Colors.commons.gray3,
        borderRadius: "15px",
        padding: "14px",
        marginBottom: "10px",
        cursor: "pointer"
    },
    listItemSelected: {
        border: "1px solid " + Colors.primary.main,
        borderRadius: "15px",
        padding: "10px",
        marginBottom: "10px",
        cursor: "pointer"
    },
    paperWidthMd: {
        maxWidth: 1100
    },

    input: {
        width: '100%',
        padding: '20px'
    },

    textoErroSenha: {
        marginTop: '-20px',
        marginLeft: '25px',
        display: "inline-flex",
        width: "100%",
        fontSize: '12px',
        color: Colors.commons.red
    }
});

export default styles;