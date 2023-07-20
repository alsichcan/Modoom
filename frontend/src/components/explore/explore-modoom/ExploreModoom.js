import React, {Fragment, useEffect, useState} from 'react';
import {Row, Col} from 'reactstrap';
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";
import axios from "axios";
import {axiosGet} from "../../../actions/axios";
import urls from "../../../urls";
import FeedCard from "../../feeds/FeedCard";

const ExploreModoom = () => {
    const {bottomRef, data} = useInfiniteScroll(urls().exploreModooms)

    return (
        <Fragment>
            {data.map(modoom => {
                return <FeedCard key={modoom.id} feed={modoom} useLink/>
            })}
            <div ref={bottomRef}/>
        </Fragment>
    );
};

export default ExploreModoom;