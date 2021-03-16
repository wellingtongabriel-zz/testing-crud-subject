import React from 'react';

import styled from 'styled-components';
import colors from '../template/Colors';

const color = (color) => {

    if (color === 'primary') {
        return colors.primary.main
    }

    return colors.commons.fontColor
};


const Text = styled.p`
    font-size: 1rem;
    color: ${props => color(props.color)}

`;


export default (props) => {
    const {text} = props;

    return (
        <Text {...props}>
            {text}
        </Text>
    );


};

