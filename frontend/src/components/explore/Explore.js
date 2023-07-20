import React, {Fragment, useContext, useEffect, useLayoutEffect, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons/faChevronRight";
import {faUserFriends} from "@fortawesome/free-solid-svg-icons/faUserFriends";
import {Link, useHistory} from "react-router-dom";
import urls, {appUrls} from "../../urls";
import CardSectionWithTitle from "../common/CardSectionWithTitle";
import InteractionButton from "../common/InteractionButton";
import axios from "axios";
import {axiosGet} from "../../actions/axios";
import AppContext from "../../context/Context";
import {defaultAppBarState} from "../../Main";
import NavigationTab, {NavigationTabContainer} from "../common/NavigationTab";
import ExploreKeyword from "./explore-keyword/ExploreKeyword";
import ExploreModoom from "./explore-modoom/ExploreModoom";
import ExplorePost from "./explore-post/ExplorePost";

const exploreTabs = [
    {id: 0, name: '키워드'},
    {id: 1, name: '모둠'},
    {id: 2, name: '게시글'},
    // {id: 3, name: '사람'},
]

const SwitchExplore = ({tabId}) => {
    switch (tabId) {
        case 0:
            return <ExploreKeyword/>;
        case 1:
            return <ExploreModoom/>;
        case 2:
            return <ExplorePost/>;
        case 3:
            return '';
        default:
            return null;
    }
};

const Explore = () => {
    const {setAppBarState} = useContext(AppContext);
    const [selectedTabId, setTabId] = useState(0);

    useLayoutEffect(() => {
        setAppBarState({...defaultAppBarState, title: '인기 키워드', useSearch: true})
    }, [])

    return (
        <Fragment>
            {/*<NavigationTabContainer>*/}
            {/*    {exploreTabs.map(tab => {*/}
            {/*        return <NavigationTab key={tab.id} text={tab.name} onClick={() => setTabId(tab.id)}*/}
            {/*                              active={tab.id === selectedTabId}/>*/}
            {/*    })}*/}
            {/*</NavigationTabContainer>*/}
            <SwitchExplore tabId={selectedTabId}/>
        </Fragment>
    );
};

export default Explore;