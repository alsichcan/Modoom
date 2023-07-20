import React, {useState, useEffect, useRef, useContext} from 'react';
import {axiosGet} from "../actions/axios";
import {useInView} from "react-intersection-observer";
import axios from "axios";
import urls from "../urls";
import {AuthContext} from "../context/Context";

const useInfiniteScroll = (url, params) => {
    const {authState} = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [nextUrl, setNextUrl] = useState(null);
    const [bottomRef, inView] = useInView({rootMargin: '100% 0px'});
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [toggle, setToggle] = useState(false);

    const refresh = () => {
        setToggle(!toggle);
    };

    useEffect(() => {
        const source = axios.CancelToken.source();
        if (url && authState.token) {
            setLoading(true);
            axiosGet(source, url, params).then(newData => {
                setLoading(false);
                setData(newData?.results || []);
                setNextUrl(newData?.next);
            });
        }
        return () => {
            source.cancel();
        };
    }, [authState.token, toggle]);

    useEffect(() => {
        if (inView && nextUrl) {
            setLoadingMore(true);
            axiosGet(null, nextUrl).then(newData => {
                setLoadingMore(false);
                setData([...data, ...(newData?.results || [])]);
                setNextUrl(newData?.next);
            });
        }
    }, [inView]);
    return {data, setData, nextUrl, setNextUrl, loading, loadingMore, setLoading, setLoadingMore, bottomRef, refresh};
};

export default useInfiniteScroll;