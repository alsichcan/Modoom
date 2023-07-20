import React, {Fragment, useContext, useEffect} from 'react';
import {Col} from 'reactstrap';
import AppContext, {SearchContext} from "../../../context/Context";
import {defaultAppBarState} from "../../../Main";
import SearchInput from "./SearchInput";
import NavigationTab, {NavigationTabContainer} from "../../common/NavigationTab";
import InteractionButton from "../../common/InteractionButton";
import SearchResults from "./SearchResults";
import NotFoundWrapper from "../../common/not-found/NotFoundWrapper";
import HorizontalLoader from "../../common/HorizontalLoader";
import {searchTabs} from "./SearchProvider";


const Search = () => {
    const {setAppBarState} = useContext(AppContext);
    const {onSearch, searchKeyword, setSearchKeyword, query, setQuery, results, setResults, loading, setNextUrl, bottomRef} = useContext(SearchContext);


    useEffect(() => {
        setAppBarState({...defaultAppBarState, hidden: true})
    }, []);


    return (
        <Fragment>
            <NavigationTabContainer borderBottom={false} className='py-2'>
                <Col>
                    <SearchInput onSearch={onSearch} value={searchKeyword} setValue={setSearchKeyword}/>
                </Col>
                <Col className='col-auto pl-2 d-flex'>
                    <InteractionButton icon='Search' onClick={onSearch}/>
                </Col>
            </NavigationTabContainer>
            <NavigationTabContainer>
                {searchTabs.map(tab => {
                    return <NavigationTab key={tab.id} text={tab.text} active={query === tab.query}
                                          onClick={() => {
                                              setResults(null);
                                              setNextUrl(null);
                                              setQuery(tab.query)
                                          }}/>;
                })}
            </NavigationTabContainer>
            <SearchResults query={query} data={results}/>
            {!loading && results === null &&
            <NotFoundWrapper className='mt-5' title='검색어를 입력해주세요.'/>}
            {!loading && results?.length === 0 && <NotFoundWrapper className='mt-5' title='검색 결과가 존재하지 않습니다.'/>}
            {loading && <div className='d-flex flex-center py-6'>
                <HorizontalLoader/>
            </div>}
            <div ref={bottomRef}/>
        </Fragment>
    );
};

export default Search;