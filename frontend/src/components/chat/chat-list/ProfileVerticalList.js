import React, {Fragment, useContext} from 'react';
import {AuthContext, NotificationContext} from "../../../context/Context";
import CardSection from "../../common/CardSection";
import ProfileVerticalListItem from "../../explore/explore-keyword/ProfileVerticalListItem";
import {appUrls} from "../../../urls";
import InteractionButton from "../../common/InteractionButton";

const ProfileVerticalList = ({dmData}) => {
    const {authState} = useContext(AuthContext);
    const {notiData} = useContext(NotificationContext);
    return (
        <Fragment>
            <div className='mt-3 container d-flex justify-content-end'>
                <InteractionButton text='메시지 보내기' icon='Plus' to={appUrls({nickname: authState.user.nickname}).profileFriends}/>
            </div>
            {dmData.map((directRoomStatus, index) => {
                const directRoom = directRoomStatus.chat_room;
                const profile = directRoom.participants.find(profile => profile.uid !== authState.user.uid);
                if (!!!profile) {
                    return null;
                }
                const unreadCount = notiData.direct_chat.find(cr=>cr.chat_room === directRoom.id)?.unread_count || 0;
                return <CardSection key={directRoom.id}>
                    <ProfileVerticalListItem profile={profile} isLast to={appUrls({nickname: profile.nickname}).chatsDirect} unreadCount={unreadCount}/>
                </CardSection>
            })}
        </Fragment>
    );
};

export default ProfileVerticalList;