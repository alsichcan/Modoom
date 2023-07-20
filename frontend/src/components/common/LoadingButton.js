import React from 'react';
import {Button} from 'reactstrap';
import classNames from 'classnames'
import {UserPlus, Users} from "react-feather";

const LoadingButton = ({loading, block, text, loadingText, size, onClick, className, style, rounded, outline}) => {
    return (
        <Button block={block} color='primary' size={size} className={classNames(className, {
            'border-radius-1': rounded,
        })} onClick={onClick} style={style}>
            {/*<UserPlus size={15} className={'align-middle mr-1'}/>*/}
            <span className='align-middle'>{text}</span>
        </Button>
    );
};

export default LoadingButton;