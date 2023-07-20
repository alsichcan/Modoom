import React, {Fragment, useContext, useLayoutEffect} from 'react';
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import urls from "../../urls";
import ProfileVerticalListItem from "../explore/explore-keyword/ProfileVerticalListItem";
import AppContext, {ProfileContext} from "../../context/Context";
import CardSection from "../common/CardSection";
import {defaultAppBarState} from "../../Main";
import ModoomeesNotFound from "../common/not-found/ModoomeesNotFound";

const Modoomees = () => {
    const {nickname} = useContext(ProfileContext);
    const {setAppBarState} = useContext(AppContext);
    const {data, bottomRef} = useInfiniteScroll(urls({nickname}).modoomees)

    useLayoutEffect(() => {
        setAppBarState({...defaultAppBarState, title: '함께한 모둠원 목록', useBackButton: true})
    },[]);

    return (
        <Fragment>
            <div className='container'>
                {data.map(profile => {
                    return <CardSection>
                        <ProfileVerticalListItem key={profile.id} profile={profile} isLast={true}/>
                    </CardSection>
                })}
                {!!data.length || <ModoomeesNotFound className='mt-7'/>}
            </div>
            <div ref={bottomRef}/>
        </Fragment>
    )
};

export default Modoomees;