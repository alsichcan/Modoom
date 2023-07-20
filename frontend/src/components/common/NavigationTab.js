import React from 'react';
import {Row, Col} from 'reactstrap';
import classNames from "classnames";

export const NavigationTabContainer = ({children, rowClassName, borderBottom=true, className}) => {
    return (
        <div className={classNames('bg-white', {'border-bottom': borderBottom, [className]: !!className})}>
            <div className='container pt-1'>
                <Row noGutters className={rowClassName}>
                    {children}
                </Row>
            </div>
        </div>
    )
};

const NavigationTab = ({text, active, onClick}) => {
    return (
        <Col className={classNames('text-center user-select-none', {
            'menu-active text-800 font-weight-semi-bold': active,
            'text-600 font-weight-medium': !active
        })}>
            <div className='fs-0 pb-2 cursor-pointer' onClick={onClick}>
                {text}
            </div>
        </Col>
    )
};

export default NavigationTab;