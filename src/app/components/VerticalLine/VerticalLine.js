import React from 'react';
import classnames from "classnames"
import verticalLineStyles from "./VerticalLine.scss"

const VerticalLine = ({className, ...props}) => {


    return (
        <div className={classnames(
            verticalLineStyles["vertical-line"],
            className
        )}
             {...props}
        />
    )
};

export default VerticalLine;