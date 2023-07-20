import React from 'react';
import NotFoundEmoji from "./NotFoundEmoji";

const NotFoundWrapper = ({className, title, children}) => {
    return (
        <div className={className}>
            <NotFoundEmoji size={100}/>
            <div className='text-center fs--1 mb-2'>
                <div className='mt-2 text-800 font-weight-medium'>
                    {title}
                </div>
                <div className='mt-1 fs--2'>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default React.memo(NotFoundWrapper);