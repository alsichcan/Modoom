import React from 'react';
import {Row, Col} from 'reactstrap';
import InteractionButton from "./InteractionButton";

const InteractionButtonWrapperDiv = ({children}) => {
    return (
        <div className='container'>
            <Row className='d-flex flex-center mt-4 mb-4'>
                <InteractionButton text='취소' className='py-1 mr-3' width='8rem' onClick={()=>{
                    window.history.back();}}/>
                {children}
            </Row>
        </div>
    );
};

export default InteractionButtonWrapperDiv;