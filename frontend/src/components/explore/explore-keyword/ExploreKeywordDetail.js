import React, {Fragment, useContext, useEffect, useLayoutEffect, useState} from 'react';
import axios from "axios";
import {axiosGet, axiosPatch} from "../../../actions/axios";
import urls, {appUrls} from "../../../urls";
import CardSectionWithTitle from "../../common/CardSectionWithTitle";
import ProfileVerticalListItem from "./ProfileVerticalListItem";
import AppContext from "../../../context/Context";
import {defaultAppBarState, defaultModalState} from "../../../Main";
import SectionWithTitle from "../../common/SectionWithTitle";
import FeedCard from "../../feeds/FeedCard";
import Section from "../../common/Section";
import CardSection from "../../common/CardSection";
import InteractionButton from "../../common/InteractionButton";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";

const ExploreKeywordDetail = ({match: {params: {keyword}}}) => {
    const {appBarState, setAppBarState, setModalState} = useContext(AppContext);
    const {data, bottomRef} = useInfiniteScroll(urls({keyword}).keywordsModooms);

    useLayoutEffect(() => {
        setAppBarState({...defaultAppBarState, title: keyword, useBackButton: true})
    }, [])

    return (
        <Fragment>
            <SectionWithTitle
                title='이 키워드와 관련된 모둠'
                button={<InteractionButton text='모둠 만들기' fill icon='Plus' to={appUrls().createModoom + `?keyword=${keyword}`}/>}
            >
                {data.map((modoom, index) => {
                    return <FeedCard key={modoom.id} feed={modoom} useLink/>
                })}
                <div ref={bottomRef}/>
            </SectionWithTitle>
        </Fragment>
    );
};

export default ExploreKeywordDetail;