import React, {Fragment} from 'react';
import {Row, Col, Input} from 'reactstrap';
import classNames from "classnames";
import {AlertCircle} from "react-feather";

const WizardInputInner = ({type, name, placeholder,innerRef, errors, className, ...rest}) => {
    return (
        <Input
            type={type}
            name={name}
            placeholder={placeholder}
            innerRef={innerRef}
            autoComplete='off'
            className={classNames('modoom-form-control', {
                [className]: className
            })}
            {...rest}
        />
    );
};

export default WizardInputInner;