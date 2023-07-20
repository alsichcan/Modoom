import React from 'react';
import {Row, Col, Input} from 'reactstrap';
import classNames from "classnames";

const TextInputRow = ({type, name, placeholder, innerRef, errors, className}) => {
    return (
        <Input
            type={type}
            name={name}
            placeholder={placeholder}
            innerRef={innerRef}
            autoComplete='off'
            className={classNames('modoom-form-control', {
                'border-danger': errors[name],
                [className]: className
            })}
        />
    );
};

export default TextInputRow;