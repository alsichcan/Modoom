import React from 'react';
import {Row, Col} from 'reactstrap';
import classNames from 'classnames';

const CardSection = ({className, containerClassName, children, hasPadding = true, hasMargin = true, onClick, innerClassName}) => {
    return (
        <div className={className}>
            <div className={classNames('container', {
                [containerClassName]: !!containerClassName
            })}>
                <div onClick={onClick} className={classNames('bg-white border-radius-1 custom-shadow', {
                    'p-3': hasPadding,
                    'my-3 my-sm-3': hasMargin,
                    [innerClassName]: !!innerClassName,
                    'cursor-pointer': !!onClick
                })}>
                    {children}
                </div>
            </div>
        </div>
    );
};


export default CardSection;