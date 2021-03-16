import React from 'react';
import classnames from "classnames"
import radioStyle from "./Radio.scss"

import styled from "styled-components"

const RadioButton = styled.div`
    margin: 6px 0 6px 10px;
    position: relative;
    align-items: center;
    display: flex;
    
    label {
     margin-top:3px;
     font-size: 14px;
     color: #333333;
     cursor:pointer;
    }
    
    input {
        margin-right: 5px;
        display:none;
    }
`;


const Radio = (props) => {
    const {className, ...other} = props;

    return (
        <RadioButton className={className}>
            <input id={props.value} className={classnames(radioStyle["css-radio"] )}
                   type="radio" {...other}
            />
            <label htmlFor={props.value}>{props.label}</label>
        </RadioButton>
    )

};

export default Radio;