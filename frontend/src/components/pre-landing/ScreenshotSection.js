import React from 'react';
import {Row, Col} from 'reactstrap';

const ScreenshotSection = ({src, title, lead}) => {
    return (
        <div className='mt-5'>
            <div className='text-center'>
                {/*<div className='text-900 fs-3 font-weight-bold my-2'>*/}
                {/*    {title}*/}
                {/*</div>*/}
                <div className='fs-1 mb-4 text-900 px-3 word-break-keep-all font-weight-semi-bold'>
                    {lead}
                </div>
                <img src={src} alt={src} style={{width: '20rem', borderRadius:'0.75rem'}}
                     className='border-300 border-1x border-solid shadow'/>
            </div>

        </div>
    );
};

export default ScreenshotSection;