import React from 'react';
import {Input} from 'reactstrap';
import classNames from "classnames";

const TextAreaInput = ({placeholder, name, innerRef, errors}) => {
    return (
        <Input
                    type="textarea"
                    rows={5}
                    name={name}
                    placeholder={placeholder}
                    innerRef={innerRef}
                    autoComplete='off'
                    className={classNames('modoom-form-control d-inline-block', {
                        'border-danger': errors[name]
                    })}
                />
    );
};

export default TextAreaInput;