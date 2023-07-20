import React from 'react';
import {Row, Col, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import Media from "reactstrap/lib/Media";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const CreateChatRoomModal = ({toggle, isOpen}) => {
    return (
        <Modal fade={false} isOpen={isOpen} toggle={toggle} size='sm' centered>
            <ModalHeader className="border-200">
                <Media className="align-items-center">
                    <div className='icon-item shadow-none bg-soft-secondary'>
                        <FontAwesomeIcon
                            icon='share-alt'
                            className='text-secondary'
                            transform='grow-5'
                        />
                    </div>
                    <Media body className="ml-2 word-break-keep-all">
                        공유
                    </Media>
                </Media>
            </ModalHeader>
            <ModalBody className="border-top border-200 px-3">
                메롱
            </ModalBody>
            <ModalFooter className="border-200">

            </ModalFooter>
        </Modal>
    );
};

export default CreateChatRoomModal;