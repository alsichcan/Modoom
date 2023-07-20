import React, {Fragment, useContext, useLayoutEffect} from 'react';
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import urls from "../../urls";
import ProfileVerticalListItem from "../explore/explore-keyword/ProfileVerticalListItem";
import AppContext, {ProfileContext} from "../../context/Context";
import CardSection from "../common/CardSection";
import {defaultAppBarState} from "../../Main";
import FriendsNotFound from "../common/not-found/FriendsNotFound";

const Friends = () => {
    const {nickname} = useContext(ProfileContext);
    const {setAppBarState} = useContext(AppContext);
    const {data, bottomRef} = useInfiniteScroll(urls({nickname}).friends)

    useLayoutEffect(() => {
        setAppBarState({...defaultAppBarState, title: '친구 목록', useBackButton: true})
    },[]);

    return (
        <Fragment>
            <div className='container'>
                {data.map(profile => {
                    return <CardSection>
                        <ProfileVerticalListItem key={profile.id} profile={profile} isLast={true}/>
                    </CardSection>
                })}
                {!!data.length || <FriendsNotFound className='mt-7'/>}
            </div>
            <div ref={bottomRef}/>
        </Fragment>
    )
};

export default Friends;