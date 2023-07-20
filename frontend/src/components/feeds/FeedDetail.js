import React, {Fragment, useContext, useEffect, useLayoutEffect, useState} from 'react';
import AppContext, {AuthContext, FeedDetailContext} from "../../context/Context";
import axios from "axios";
import {axiosGet} from "../../actions/axios";
import urls, {appUrls} from "../../urls";
import FeedCard from "./FeedCard";
import Helmet from "react-helmet";
import MessageInputContainer from "../chat/chat-room/MessageInputContainer";
import FeedComments from "./FeedComments";
import {defaultAppBarState} from "../../Main";
import {Link} from "react-router-dom";
import {ArrowRight} from "react-feather";
import {useHistory} from 'react-router-dom';
import {toast} from "react-toastify";

const FeedDetail = ({match: {params: {feedId}}}) => {
    const history = useHistory();
    const {authState} = useContext(AuthContext);
    const {appBarState, setAppBarState} = useContext(AppContext);
    const [feed, setFeed] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [toggleComments, setToggleComments] = useState(false);
    const [toggleFeed, setToggleFeed] = useState(false);
    const [pendingCount, setCount] = useState(0);
    const myEnrollment = feed?.enrollments?.find(enrollment => enrollment.profile.nickname === authState.user.nickname);

    const refreshFeed = () => {
        setToggleFeed(!toggleFeed);
    }

    const refreshComments = () => {
        setToggleComments(!toggleComments);
    };

    useLayoutEffect(() => {
        setAppBarState({...defaultAppBarState, title: feed?.title, useBackButton: true})
    }, [feed]);

    useEffect(() => {
        const source = axios.CancelToken.source();
        axiosGet(source, urls({feedId}).feed).then(data => {
            if (data) {
                if (data.deleted) {
                    history.push(appUrls().home);
                    toast.error('삭제된 게시글입니다.');
                    return
                }
                setFeed(data);
                setIsLiked(data.liked);
                setLikes(data.n_likes);
            }
        });
    }, [toggleFeed]);

    useEffect(() => {
        if (feed) {
            setCount(feed.enrollments.reduce((prev, curr) => prev + (!curr.accepted ? 1 : 0), 0));
        }
    }, [feed]);

    const value = {
        feedId,
        feed,
        isLiked,
        setIsLiked,
        likes,
        setLikes,
        toggleComments,
        refreshComments,
        refreshFeed
    }
    return (
        <FeedDetailContext.Provider value={value}>
            <Helmet bodyAttributes={{style: 'background-color : #fff'}}/>
            <div className='container pt-2'>
                {feed && <FeedCard feed={feed} itemOnly showDetail likes={likes}/>}
            </div>
            <hr className='border-200 mt-3 mb-0'/>
            {pendingCount !== 0 && <div className='container py-2 fs--1 font-weight-medium text-800 align-middle'>
                <span className='align-middle'>
                    <strong className='text-danger font-weight-bold'>{pendingCount}</strong>명이 가입 신청 중입니다.
                </span>
                {myEnrollment?.is_leader && <Link className='ml-2 align-middle' to={appUrls({modoomId: feedId}).chatsModoomInfo}>확인하기</Link>}
            </div>}
        </FeedDetailContext.Provider>
    );
};

export default FeedDetail;