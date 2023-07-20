import React, {Fragment, useContext, useLayoutEffect} from 'react';
import {Row, Col} from 'reactstrap';
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";
import urls from "../../../urls";
import {defaultAppBarState} from "../../../Main";
import AppContext from "../../../context/Context";
import ProfileVerticalListItem from "./ProfileVerticalListItem";
import CardSection from "../../common/CardSection";
import truncate from 'lodash/truncate';

const ExploreKeywordProfiles = ({match: {params: {keyword}}}) => {
    const {setAppBarState} = useContext(AppContext);
    const {data, bottomRef} = useInfiniteScroll(urls({keyword}).keywordsProfiles);
    useLayoutEffect(() => {
        setAppBarState({
            ...defaultAppBarState,
            title: truncate(keyword + `를 팔로우하는 사람들`, {length: 23, omission: '..'}),
            useBackButton: true
        })
    }, [])
    return (
        <Fragment>
            {data.map((profile, index) => {
                return <CardSection>
                    <ProfileVerticalListItem key={profile.id} profile={profile} isLast={true}/>
                </CardSection>
            })}
            <div ref={bottomRef}/>
        </Fragment>
    );
};

export default ExploreKeywordProfiles;