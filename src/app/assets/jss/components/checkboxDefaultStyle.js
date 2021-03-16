import {grayLight} from "../appHealth.style";

const checkboxDefaultStyle = {
    label: {
        color: grayLight,
        fontSize: '0.75rem'
    },

    input: {

        '&[type="checkbox"]:checked + label': {

            top: "-1px",
            width: "12px",
            height: "12px",
            margin: "-1px 0px 0 0",
            border: "1px solid #ccc",
            display: "inline-block",
            position: "relative",
            verticalAlign: "middle",
            background: "white left top no-repeat",
            cursor: "pointer",

            marginRight: "4px"
        },
    }
};


export default checkboxDefaultStyle;