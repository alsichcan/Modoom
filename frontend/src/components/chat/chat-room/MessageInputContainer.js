import React, {useState} from 'react';
import {Row, Col, Input} from 'reactstrap';
import InteractionButton from "../../common/InteractionButton";
import TextareaAutosize from "react-autosize-textarea";
import {Send} from "react-feather";

const MessageInputContainer = ({onSend, message, setMessage}) => {
    return (
        <div className='page-tabs-container border-top'>
            <div className='container chat-input-container'>
                <Row noGutters className='fs--1 w-100 py-2'>
                    <Col className='pr-2'>
                        <TextareaAutosize placeholder='메시지를 입력하세요.'
                                          autoComplete="off" name='notASearchField'
                                          value={message}
                                          onKeyPress={e => {
                                              if (e.key === 'Enter') {
                                                  e.preventDefault();
                                                  onSend();
                                              }
                                          }}
                                          onChange={e => setMessage(e.target.value)}
                                          maxRows={3}
                                          className="px-2 form-control form-control-md border-radius-1"
                        />
                    </Col>
                    <Col className='col-auto mt-auto'>
                        <div onClick={onSend}
                             className='font-weight-bold text-primary fs-0 cursor-pointer user-select-none pb-1'>
                            <Send className=''/>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default MessageInputContainer;