const NotificationStyle = {
    message: {
        display: "flex",
        flex: 1,
        alignItems: 'center',
        paddingTop: 7,
        "& section": {
            borderRadius: "50px",
            margin: "14px 30px",
            padding: "13px 25px",
            flex: 1,
            maxWidth: "60%"
        }
    },

    container: {
        userSelect: 'none',
        paddingLeft: 8,
        alignItems: "center",
        display: "flex",
        height: 100,
        cursor: "pointer"
    }

};

export default NotificationStyle;