import {primaryColor} from "../appHealth.style";

const ContactProfileStyle = {
    primaryColor,
    gridItem: {
        display: "grid",
        padding: "0 0 0 20px",
    },

    container: {
        backgroundColor: primaryColor,
        color: "#fff",
        "& p, & div p": {
            textAlign: "center",
        },
    },

    containerInternal: {
        width: 'auto',
        height: '100%',
        backgroundColor: '#00ACA6B3',
        padding: '0 50px'
    },

    iconButton: {
        marginLeft: -50
    },

    closeIcon: {
        fontSize: 62,
        color: 'white',
    },

    profileInfo: {
        marginTop: 120
    },

    userDateAvailability: {
        display: "flex",
        "& p": {
            borderRadius: "5px",
            backgroundColor: "red",
            opacity: "0.5",
            padding: "5px 9px",
            marginRight: "13px",
        },
        "& p:last-child": {
            marginRight: "0",
        },
    },

    userName: {
        fontSize: "34px",
    }
};

export default ContactProfileStyle;