import React, {Fragment, useContext, useEffect, useRef, useState} from 'react';
import axios from "axios";
import Comment from "./Comment";
import CommentInputContainer from "./CommentInputContainer";
import {FeedDetailContext} from "../../context/Context";
import {axiosGet, axiosPost} from "../../actions/axios";
import urls from "../../urls";
import useDidMountEffect from "../../hooks/useDidMountEffect";
import {useGA4React} from "ga-4-react";

const FeedComments = () => {
    const {feedId, feed, toggleComments, refreshComments} = useContext(FeedDetailContext);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [targetComment, setTargetComment] = useState(null);
    const [cachedName, setCachedName] = useState('');
    const [toggleScroll, setToggleScroll] = useState(false);
    const inputRef = useRef(null);
    const commentsEndRef = useRef(null)

    const scrollToBottom = () => {
        if (commentsEndRef.current) {
            commentsEndRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }

    useEffect(() => {
        const source = axios.CancelToken.source();
        axiosGet(source, urls({id: feedId}).commentFeed, {limit: 100}).then(data => {
            setComments(data?.results);
        });
    }, [toggleComments]);

    useEffect(() => {
        if (targetComment !== null) {
            inputRef.current.focus();
            setCachedName(targetComment.profile.last_name + targetComment.profile.first_name)
        }
    }, [targetComment]);

    useDidMountEffect(() => {
        if (toggleScroll) {
            scrollToBottom();
        }
    }, [comments]);

    const ga = useGA4React();
    const onSubmit = () => {
        const trimmedComment = comment.trim();
        if (trimmedComment === '') {
            return;
        }

        ga.gtag('event', 'comment', {
            'event_category': 'modoom',
            'event_label': feed.id,
        });

        // 대댓글인 경우
        if (targetComment !== null) {
            axiosPost(null, urls({id: targetComment.id}).commentComment, {text: trimmedComment}).then(data => {
                if (data?.success) {
                    setToggleScroll(false);
                    setComment('');
                    setTargetComment(null);
                    refreshComments();
                }
            });
            return;
        }
        // 일반 댓글 업로드인 경우
        axiosPost(null, urls({id: feedId}).commentFeed, {text: trimmedComment}).then(data => {
            if (data?.success) {
                setToggleScroll(true);
                refreshComments();
                setComment('');
            }
        })
    }
    return (
        <Fragment>
            <div className='container'>
                {comments?.map(comment => {
                    return <Fragment key={comment.id}>
                        <Comment comment={comment} setTargetComment={setTargetComment}
                                 setToggleScroll={setToggleScroll}/>
                        {comment?.subcomments?.map(subcomment => {
                            return <Comment key={subcomment.id} comment={subcomment} setToggleScroll={setToggleScroll}/>
                        })}
                    </Fragment>;
                })}
            </div>
            {feed && <div className='d-flex justify-content-center'
                          style={{
                              position: 'fixed',
                              bottom: targetComment ? '3.5rem' : 0,
                              left: 0,
                              right: 0,
                              transition: 'all 0.15s ease-in'
                          }}>
                <div className='bg-white border-radius-1 shadow-sm px-3 py-1 user-select-none'>
                    <span
                        className='font-weight-medium text-800'>{cachedName}</span>님에게
                    답글 다는 중
                    <span className='mx-1'>
                        ·
                    </span>
                    <span className='font-weight-medium cursor-pointer' onClick={() => setTargetComment(null)}>취소</span>
                </div>
            </div>}
            <div ref={commentsEndRef}/>
            {feed &&
            <CommentInputContainer onSubmit={onSubmit} comment={comment} setComment={setComment} inputRef={inputRef}/>}
        </Fragment>
    );
};

export default FeedComments;