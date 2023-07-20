import React, {Fragment} from 'react';
import {Col, Input, Row} from 'reactstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import WizardInputInner from "./WizardInputInner";
import {AlertCircle} from "react-feather";
import * as Icon from 'react-feather';

const WizardInput = ({type, watch, innerRef, errors, name, placeholder, icon, featherIcon, autoComplete, ...rest}) => {
    const IconTag = Icon[featherIcon];
    return (
        <Fragment>
            <Row noGutters>
                {icon &&
                <Col className='col-auto my-auto'>
                    <FontAwesomeIcon icon={icon} fixedWidth className={classNames('mr-2', {
                        'text-500': !!!watch(name),
                        'text-800': !!watch(name)
                    })}/>
                </Col>
                }
                {featherIcon &&
                <Col className='col-auto my-auto'>
                    <IconTag size={18} className={classNames('mr-2', {
                        'text-500': !!!watch(name),
                        'text-800': !!watch(name)
                    })}/>
                </Col>
                }
                <Col>
                    <WizardInputInner
                        type={type}
                        name={name}
                        placeholder={placeholder}
                        innerRef={innerRef}
                        autoComplete={autoComplete || 'off'}
                        className='modoom-form-control d-inline-block'
                        {...rest}
                    />
                </Col>
            </Row>
            {errors?.[name] && <div className='fs--2 text-danger'>
                <AlertCircle size={15} className='mr-1'/>
                {errors?.[name].message}
            </div>}
        </Fragment>
    );
};

export default WizardInput;