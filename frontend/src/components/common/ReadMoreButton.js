import React from 'react';
import {Row, Col} from 'reactstrap';
import InteractionButton from "./InteractionButton";
import classNames from 'classnames'

const ReadMoreButton = ({className}) => {
    return (
        <div className={classNames('container d-flex justify-content-center', {
            [className]: !!className
        })}>
            <div style={{width: '7rem'}}>
                <InteractionButton text={'더보기'} className='bg-white shadow py-1'/>
            </div>
        </div>
    );
};

export default ReadMoreButton;