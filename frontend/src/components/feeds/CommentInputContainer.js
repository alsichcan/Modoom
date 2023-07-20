import React, {useContext, useState} from 'react';
import {Col, Input, Row} from 'reactstrap';
import InteractionButton from "../common/InteractionButton";
import {faHeart} from "@fortawesome/free-solid-svg-icons/faHeart";
import {faHeart as farHeart} from "@fortawesome/free-regular-svg-icons/faHeart";
import classNames from "classnames";
import {axiosPost} from "../../actions/axios";
import urls from "../../urls";
import {FeedDetailContext} from "../../context/Context";
import {Send} from "react-feather";
import TextareaAutosize from 'react-autosize-textarea';

const CommentInputContainer = ({onSubmit, comment, setComment, inputRef}) => {
    return (
        <div className='page-tabs-container border-top'>
            <div className='container chat-input-container'>
                <Row noGutters className='fs--1 w-100 py-2'>
                    <Col className='pr-2'>
                        <TextareaAutosize placeholder='댓글을 작성하세요.'
                                          ref={inputRef}
                                          onKeyPress={e => {
                                              if (e.key === 'Enter') {
                                                  e.preventDefault();
                                                  onSubmit();
                                              }
                                          }}
                                          autoComplete="off" name='notASearchField'
                                          value={comment}
                                          onChange={e => setComment(e.target.value)}
                                          maxRows={3}
                                          className="px-2 form-control form-control-md border-radius-1"
                        />
                    </Col>
                    <Col className='col-auto mt-auto'>
                        <div onClick={onSubmit}
                             className='font-weight-bold text-primary fs-0 cursor-pointer user-select-none pb-1'>
                            <Send className=''/>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default CommentInputContainer;