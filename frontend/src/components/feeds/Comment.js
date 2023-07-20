import React, {Fragment, useContext, useState} from 'react';
import {Row, Col} from 'reactstrap';
import AppContext, {AuthContext, FeedDetailContext} from "../../context/Context";
import Avatar from "../common/Avatar";
import {axiosDelete} from "../../actions/axios";
import urls, {appUrls} from "../../urls";
import {defaultModalState} from "../../Main";
import classNames from 'classnames';
import ProfileAvatar from "../common/ProfileAvatar";
import Moment from 'react-moment';
import {Link} from "react-router-dom";
// import moment from "moment";

const Comment = ({comment, isLast, setTargetComment, setToggleScroll}) => {
    const {authState} = useContext(AuthContext);
    const {modalState, setModalState} = useContext(AppContext);
    const {refreshComments} = useContext(FeedDetailContext);
    const profile = comment.profile;
    const isSubcomment = !!!setTargetComment;
    const onDelete = () => {
        axiosDelete(null, isSubcomment ? urls({id: comment.id}).commentSubcomment : urls({id: comment.id}).commentComment).then(data => {
            if (data?.success) {
                setToggleScroll(false);
                refreshComments();
            }
        });
    };

    const withModal = (onClick) => () => {
        setModalState({...defaultModalState, title: '댓글을 삭제하시겠습니까?', isOpen: true, onConfirm: onClick})
    };

    const onReply = () => {
        setTargetComment(comment);
    };

    if (!isSubcomment && !!!comment.subcomments?.length && comment.deleted) {
        return null;
    }

    if (comment.deleted) {
        if (isSubcomment) {
            return null;
        } else if (!!!comment.subcomments?.length) {
            return null;
        }
    }

    return (
        <Fragment>
            <Row className={classNames('py-2', {'': isSubcomment})} noGutters
                 style={isSubcomment ? {paddingLeft: '2.5rem'} : {}}>
                <Col className='col-auto pr-2'>
                    <ProfileAvatar profile={comment.deleted || profile} useLink
                                   className='align-middle'/>
                </Col>
                <Col>
                    <Link className='fs--1 text-900 font-weight-medium text-decoration-none' to={appUrls({nickname: profile?.nickname}).profile}>
                        {comment.deleted ? '' : profile.full_name}
                    </Link>
                    <div className='fs--1 text-800 word-break-keep-all'>
                        {comment.text_show.split('\n').map((line, index) => {
                            return (<span key={index}>{line}<br/></span>)
                        })}
                    </div>
                    <Moment locale='ko' fromNow className='fs--2'>{comment.created_at}</Moment>
                </Col>
                {comment.deleted || <Col className='col-auto fs--1'>
                    {setTargetComment && <span className='cursor-pointer' onClick={onReply}>
                        답글
                    </span>}
                    {authState.user.uid === profile?.uid &&
                    <Fragment>
                        {/*<span className='mr-2'>*/}
                        {/*수정*/}
                        {/*</span>*/}
                        <span className='ml-2 text-danger cursor-pointer' onClick={withModal(onDelete)}>
                        삭제
                        </span>
                    </Fragment>
                    }
                </Col>}
            </Row>
            {isLast || <hr className='my-0 border-200'/>}
        </Fragment>
    );
};

export default Comment;