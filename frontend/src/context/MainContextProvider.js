import React, {useState} from 'react';
import {Row, Col} from 'reactstrap';
import {MainContext} from "./Context";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import urls from "../urls";

const MainContextProvider = ({children}) => {
    // 전역 상태 관리를 모방한다.
    const [showModooms, setShowModooms] = useState(true);
    const {bottomRef: feedBottomRef, data: feedData, refresh: refreshFeeds} = useInfiniteScroll(urls().feeds);

    const value = {showModooms, setShowModooms, feedData, feedBottomRef,refreshFeeds}
    return (
        <MainContext.Provider value={value}>{children}</MainContext.Provider>
    );
};

export default MainContextProvider;