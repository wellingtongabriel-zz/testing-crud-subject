import {fontColor, primaryColor} from "../appHealth.style";

const selectRedeStyle = {
    main: {
        backgroundColor: "#fff",
        display: "grid",
        justifyItems: "center",
        gridTemplateColumns: "1fr",
        height: "100vh",
        overflowY: "auto"
    },

    container: {
        width: "100%",
        maxWidth: '45%',
        margin: '80px 10px',
        display: "grid",
        gridRowGap: "20px",
    },

    title: {
        fontSize: "1.25rem",
        color: fontColor,
        margin: 0
    },

    card: {
        borderLeft: `solid 4px ${primaryColor}`,
    },

    nameRede: {
        fontSize: "1rem",
        color: primaryColor,
        fontWeight: 'bold',
        margin: "16px 0 0"
    }
};

export default selectRedeStyle;


