import {blue, primaryColor, purple, red, yellow} from "../appHealth.style";
import Colors from '../../../template/Colors';

const MessageItemStyle = {
    message: {
        display: "flex",
        flex: 1,
        alignItems: 'center',
        paddingTop: 7,
        "& section": {
            borderRadius: "50px",
            margin: "14px 30px",
            padding: "3px 25px",
            flex: 1,
            maxWidth: "60%"
        }
    },

    messageImage: {
        display: "flex",
        flex: 1,
        alignItems: 'center',
        paddingTop: 7,
        "& section": {
            borderRadius: "20px",
            margin: "14px 30px",
            padding: "5px 5px",
            minWidth: 200,
            height: 'auto'
        }
    },

    messageLoader: {
        float: 'right'
    },

    messageTop: {
        marginTop: 7,
    },

    messageTime: {
        textAlign: 'right',
        marginRight: 5,
        fontSize: '12px !important',
    },

    messageContent: {
        width: 'fit-content'
    },

    messageThumb: {
        position: 'relative',
          
        '& .thumbnail':  {
            display: 'block'
        },
        
        '& .time': {
            position: 'absolute',
            zIndex: 2,
            right: '3px',
            bottom: 3,
            padding: '2px 5px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white'
        },

        '& .playWrapper': {
            opacity: 0,
            position: 'absolute',
            zIndex: 1,
            top: 0,
            width: 192,
            height: 109,
            background: 'rgba(0,0,0,0.6) url("http://wptf.com/wp-content/uploads/2014/05/play-button.png") no-repeat scroll center center / 50px 50px'
        }            
          
    },

    right: {
        justifyContent: "flex-end"
    },

    image: {
        height: "62px",
        marginTop: 5
    },

    primary: {
        backgroundColor: primaryColor,
        color: "#fff",
    },

    white: {
        backgroundColor: 'white',
        color: Colors.commons.fontColor,
        border: `${Colors.commons.gray3} 1px solid`
    },

    purple: {
        backgroundColor: purple,
        color: "#fff",
    },

    blue: {
        backgroundColor: blue,
        color: "#fff",
    },

    yellow: {
        backgroundColor: yellow,
        color: "#fff",
    },

    red: {
        backgroundColor: red,
        color: "#fff",
    }
};

export default MessageItemStyle;