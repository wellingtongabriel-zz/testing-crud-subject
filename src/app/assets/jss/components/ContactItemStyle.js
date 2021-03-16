import {fontColor, primaryColor, red, purple, blue, yellow} from "../appHealth.style";

const ContactItemStyle = {
    primaryColor,
    gridItem: {
        display: "grid",
        padding: "0 0 0 20px",
    },

    item: {
        display: "grid",
        gridTemplateColumns: "62px 1fr",
        borderRadius: "36px 0 0 36px",
        maxHeight: "62px",
        color: fontColor
    },

    itemSelected: {
        backgroundColor: primaryColor,
        color: "#fff"
    },

    info: {
        display: "grid",
        gridTemplateColumns: "1fr 20px",
        alignItems: "center",
        padding: "10px 20px",

        "& > div": {
            display: "grid",
            gridRowGap: '5px'
        },
        "& p": {
            fontSize:"14px",
        },
        "& p:last-child": {
            color: yellow,
        }
    },

    icon: {
        gridRow: 'span 2',
    },

    textInfo: {
        margin: 0,
    },

    number: {
        textAlign:"center",
        borderRadius: "50%",
        color: "#fff",
        width: "26px",
        height: "26px",
        lineHeight: "29px",
        fontFamily: "Nexa",
        fontSize: "12px"
    },

    primaryBorder: {
        borderColor: primaryColor
    },
    redBorder: {
        borderColor: red
    },
    yellowBorder: {
        borderColor: yellow
    },
    purpleBorder: {
        borderColor: purple
    },
    blueBorder: {
        borderColor: blue
    }
};

export default ContactItemStyle;