import React from 'react';
import {Row, Col} from 'reactstrap';

const SectionTitle = ({title}) => {
    return (
        <div className='mt-3 mb-1 ml-2'>
            <div className='container'>
                <div className='fs-1 font-weight-semi-bold text-800'>
                    {title}
                </div>
            </div>
        </div>
    );
};

export default SectionTitle;