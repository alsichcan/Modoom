import React, {useContext, useEffect} from 'react';
import {Row, Col} from 'reactstrap';
import CardSection from "../../common/CardSection";
import ModoomVerticalListItem from "../../feeds/ModoomVerticalListItem";
import {useHistory} from 'react-router-dom';
import {appUrls} from "../../../urls";
import AppContext, {NotificationContext} from "../../../context/Context";
import {defaultAppBarState} from "../../../Main";

const ModoomVerticalList = ({modoomData}) => {
    const {appBarState, setAppBarState} = useContext(AppContext);
    const history = useHistory();
    const {notiData} = useContext(NotificationContext);

    const onCardClick = (modoom) => () => {
        history.push(appUrls({modoomId: modoom.id}).chatsModoom)
        setAppBarState({...appBarState, title: modoom.title, useLogo:false, useBackButton: true, borderBottom: true})
    };

    return (
        modoomData.map(ModoomChatRoomStatus => {
            const modoom = ModoomChatRoomStatus.chat_room.modoom;
            const unreadCount = notiData.modoom_chat.find(cr=>cr.chat_room === modoom.id)?.unread_count || 0;
            return <CardSection key={modoom.id} onClick={onCardClick(modoom)}>
                <ModoomVerticalListItem modoom={modoom} isLast unreadCount={unreadCount}/>
            </CardSection>
        })
    );
};

export default ModoomVerticalList;