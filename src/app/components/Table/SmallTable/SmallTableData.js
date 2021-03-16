import React from "react";
import styled from 'styled-components';
import { Grid } from "@material-ui/core";
import Colors from '../../../template/Colors'

const Data = styled(Grid)`
    padding: 5px 25px;
    color: #333333;
    font-size: 0.8125rem;
    font-weight: 400;
    display: flex;
    align-self: center;
`;

const DataBorder = styled(Grid)`
    padding: 5px 25px 5px 29px;
    border-left: 2px solid rgb(229, 229, 227);
    color: ${Colors.commons.fontColor};
    font-size: 0.8125rem;
    font-weight: 400;
    display: flex;
    align-self: center;
`;

const SmallTableData = ({ value, noBorder, size = 12 }) => 
    (noBorder 
        ? <Data item xs={size} >{value}</Data> 
        : <DataBorder item xs={size} >{value}</DataBorder>
    );

export default SmallTableData;