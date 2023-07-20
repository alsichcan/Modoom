import React, {Fragment, useEffect, useState} from 'react';
import {Row, Col} from 'reactstrap';
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";
import axios from "axios";
import {axiosGet} from "../../../actions/axios";
import urls from "../../../urls";
import FeedCard from "../../feeds/FeedCard";

const ExplorePost = () => {
    const {bottomRef, data} = useInfiniteScroll(urls().explorePosts)

    return (
        <Fragment>
            {data.map(post => {
                return <FeedCard key={post.id} feed={post} useLink/>
            })}
            <div ref={bottomRef}/>
        </Fragment>
    );
};

export default ExplorePost;