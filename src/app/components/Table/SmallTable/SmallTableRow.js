import React from "react";
import { Grid } from "@material-ui/core";
import styled from 'styled-components';

const Row = styled(Grid)`
    display: flex;
    justify-content: space-between;
    cursor: ${props => props.isClickable ? 'pointer' : 'default'};

    &:hover {
        background-color: #e7f1f0;
    }
`;

const SmallTableRow = ({ children, onClick }) => {
    const isClickable = !!onClick;
    const handleClick = isClickable ? onClick : null;

    return (
        <Row container onClick={handleClick}>
            {children}
        </Row>
    );
};

export default SmallTableRow;
