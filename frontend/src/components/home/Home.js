import React, {Fragment, useContext, useEffect, useLayoutEffect, useState} from 'react';
import ReelSection from "./reels/ReelSection";
import AppContext, {MainContext} from "../../context/Context";
import {defaultAppBarState} from "../../Main";
import {axiosGet} from "../../actions/axios";
import axios from "axios";
import urls from "../../urls";
import FeedCard from "../feeds/FeedCard";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";

const Home = () => {
    const {setAppBarState} = useContext(AppContext);
    const {feedData, feedBottomRef} = useContext(MainContext)

    useLayoutEffect(() => {
        setAppBarState({...defaultAppBarState, useLogo: true, useSearch: true})
    }, []);

    return (
        <Fragment>
            <ReelSection/>
            {feedData.map(feed => {
                return <FeedCard truncateLines key={feed.id} feed={feed} useLink/>
            })}
            <div ref={feedBottomRef}/>
        </Fragment>
    );
};

export default Home;