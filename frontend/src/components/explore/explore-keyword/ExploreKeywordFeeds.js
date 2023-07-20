import React, {Fragment, useContext, useEffect, useLayoutEffect, useState} from 'react';
import AppContext from "../../../context/Context";
import {defaultAppBarState} from "../../../Main";
import axios from "axios";
import {axiosGet} from "../../../actions/axios";
import urls from "../../../urls";
import FeedCard from "../../feeds/FeedCard";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";
import truncate from 'lodash/truncate';

const ExploreKeywordFeeds = ({match: {params: {keyword, feedType}}}) => {
    const {setAppBarState} = useContext(AppContext);
    const isModooms = feedType === 'modooms';
    const {data, bottomRef} = useInfiniteScroll(isModooms ? urls({keyword}).keywordsModooms : urls({keyword}).keywordsPosts)

    useLayoutEffect(() => {
        setAppBarState({
            ...defaultAppBarState,
            title: truncate(keyword + `와 관련된 ${isModooms ? '모둠' : '게시글'}`, {length: 23, omission: '..'}),
            useBackButton: true
        })
    }, [])

    return (
        <Fragment>
            {data.map((feed, index) => {
                return (
                    <FeedCard key={feed.id} feed={feed} useLink/>
                );
            })}
            <div ref={bottomRef}/>
        </Fragment>
    );
};

export default ExploreKeywordFeeds;