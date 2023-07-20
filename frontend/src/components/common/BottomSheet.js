import React, {useState} from 'react';
import {Row, Col, Button} from 'reactstrap';
import {X} from "react-feather";
import classNames from 'classnames'

const BottomSheet = ({isOpen, setIsOpen, children, title}) => {
    const close = () => {
        setIsOpen(false);
    };
    return (
        <div>
            <div className={`bottom-popup-sheet border-1x border-500 bg-white ${isOpen ? '' : 'closed'}`}>
                <div className='container'>
                    <div className='d-flex justify-content-between align-items-center mt-3 mx-2 text-900'>
                        <div className='fs-1 font-weight-semi-bold'>
                            {title}
                        </div>
                        <div className='cursor-pointer' onClick={close}>
                            <X size={25}/>
                        </div>
                    </div>
                    <div className='px-2 pt-2 pb-3'>
                        {children}
                    </div>
                </div>
            </div>
            {isOpen && <div className={`bottom-popup-overlay`} onClick={close}/>}

        </div>
    );
};

export default BottomSheet;