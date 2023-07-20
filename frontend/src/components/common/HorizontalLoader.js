import React from 'react';

const HorizontalLoader = ({fontSize, color, className, margin}) => {
    return (
        <div className={'loading-indicator text-400 d-inline-block ' + (className || '')}
             style={{fontSize: fontSize || '7px', color: color || undefined, margin: margin}}>
            <span className='loading-dot align-middle'/>
            <span className='loading-dot align-middle'/>
            <span className='loading-dot align-middle'/>
        </div>
    );
};

export default HorizontalLoader;
