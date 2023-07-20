import React, {useState} from 'react';
import {Row, Col} from 'reactstrap';
import classNames from 'classnames'
import * as Icon from 'react-feather';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons/faCircleNotch";
import {Loader} from "react-feather";
import {useHistory} from 'react-router-dom';
import {faCircle} from "@fortawesome/free-solid-svg-icons/faCircle";

const InteractionButton = ({text, className, icon, faIcon, faClassName, highlight, fill, emoji, isLoading, loadingText = '처리 중', onClick, width, iconSize, disabled, to}) => {
    const IconTag = Icon?.[icon] || Icon['Circle'];
    const history = useHistory();
    const IconComponent = (faIcon ?
        <FontAwesomeIcon icon={faIcon || faCircle} className={faClassName || ''} transform='grow-2'/> :
        <IconTag size={iconSize || 15} className={''}/>)

    const move = () => {
        history.push(to);
    };

    const hasIcon = icon || faIcon;

    return (
        <div
            className={classNames('interaction-button d-flex justify-content-center align-items-center border-1x border border-radius-1 px-2 cursor-pointer', {
                [className]: !!className,
                'bg-white': !fill,
                'border-300': !highlight && !fill,
                'border-primary': highlight,
                'text-primary': highlight && !fill,
                'opacity-75 cursor-wait pointer-event-none': isLoading,
                'opacity-50 cursor-not-allowed pointer-event-none': disabled,
                'cursor-pointer': !isLoading,
                'text-white bg-primary interaction-button-fill border-primary': fill
            })}
            style={width && {width: width}}
            onClick={to ? move : onClick}>
            {emoji && <span className='fs-0'>{emoji}</span>}
            {hasIcon && (
                isLoading
                    ? <FontAwesomeIcon icon={faCircleNotch} className='fa-spin' transform='shrink-4'/>
                    : IconComponent
            )}
            {text && <div className={classNames('fs--1 user-select-none', {
                'ml-1': hasIcon && text
            })}>{isLoading ? loadingText : text}</div>}
        </div>
    )
};

export default React.memo(InteractionButton);