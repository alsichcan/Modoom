import React, {useContext} from 'react';
import {Col, Modal, ModalBody, ModalHeader, Row} from 'reactstrap';
import Media from "reactstrap/lib/Media";
import AppContext from "../../context/Context";
import classNames from 'classnames';

const GenericModal = () => {
    const {modalState, setModalState} = useContext(AppContext);
    const closeModal = () => {
        setModalState({...modalState, isOpen: false})
    };

    const dismiss = () => {
        if (!!modalState.onDismiss) {
            modalState.onDismiss();
        }
        closeModal();
    };

    const confirm = () => {
        if (!!modalState.onConfirm) {
            modalState.onConfirm();
        }
        closeModal();
    };

    return (
        <Modal
            modalTransition={{timeout: 0}}
            backdropTransition={{timeout: 0}}
            contentClassName='border-0 border-radius-1 custom-shadow mx-4'
            backdropClassName='generic-modal-backdrop'
            isOpen={modalState.isOpen}
            toggle={closeModal}
            centered>
            <ModalHeader className={classNames("border-bottom-0 px-2", {'pb-2': modalState.content})}>
                <Media className="align-items-center">
                    <Media body className="ml-2 word-break-keep-all">
                        {modalState.title}
                    </Media>
                </Media>
            </ModalHeader>
            {modalState.content &&
            <div className="px-3 fs--1 mb-2">
                {modalState.content}
            </div>
            }
            <div>
                <Row noGutters className='text-800 text-center border-top border-200'>
                    {modalState.oneButton || <Col className='border-right border-200 py-2 cursor-pointer' onClick={dismiss}>
                        {modalState.dismissText}
                    </Col>}
                    <Col className='py-2 cursor-pointer' onClick={confirm}>
                        {modalState.confirmText}
                    </Col>
                </Row>
            </div>
        </Modal>
    );
};

export default GenericModal;