import React, {useEffect, useState} from 'react';
import {useInView} from "react-intersection-observer";
import {axiosGet} from "../../../actions/axios";
import urls from "../../../urls";
import useDidMountEffect from "../../../hooks/useDidMountEffect";
import {SearchContext} from "../../../context/Context";

export const searchTabs = [
    {id: 0, text: '모둠', query: 'modooms'},
    {id: 1, text: '키워드', query: 'keywords'},
    {id: 2, text: '사람', query: 'profiles'},
]
const SearchProvider = ({children}) => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [query, setQuery] = useState(searchTabs[0].query);
    const [results, setResults] = useState(null);
    const [nextUrl, setNextUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [bottomRef, inView] = useInView({rootMargin: '100% 0px'});
    const loadData = () => {
        if (!!!searchKeyword) {
            return
        }
        setLoading(true);
        axiosGet(null, urls().search, {search: searchKeyword, query: query}).then(data => {
            setLoading(false);
            if (data) {
                setNextUrl(data.next);
                setResults(data.results);
            }
        });
    };

    useDidMountEffect(() => {
        loadData();
    }, [query]);

    const onSearch = () => {
        loadData();
    };

    useEffect(() => {
        if (inView && nextUrl) {
            axiosGet(null, nextUrl).then(newData => {
                if (newData) {
                    setResults([...results, ...newData.results]);
                    setNextUrl(newData.next);
                }
            });
        }
    }, [inView]);

    const value = {
        onSearch,
        inView,
        loading,
        bottomRef,
        query,
        setQuery,
        results,
        setResults,
        setNextUrl,
        searchKeyword,
        setSearchKeyword
    };

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
};

export default SearchProvider;