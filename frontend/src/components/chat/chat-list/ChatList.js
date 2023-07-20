import React, {Fragment, useContext, useEffect, useLayoutEffect, useState} from 'react';
import AppContext, {AuthContext, MainContext, NotificationContext} from "../../../context/Context";
import {defaultAppBarState} from "../../../Main";
import ModoomVerticalList from "./ModoomVerticalList";
import {axiosGet} from "../../../actions/axios";
import axios from "axios";
import urls from "../../../urls";
import NavigationTab, {NavigationTabContainer} from "../../common/NavigationTab";
import ProfileVerticalList from "./ProfileVerticalList";
import ModoomNotFound from "../../common/not-found/ModoomNotFound";
import DMNotFound from "../../common/not-found/DMNotFound";
import {UnreadBadge} from "../../feeds/ModoomVerticalListItem";


const ChatList = () => {
    const {authState} = useContext(AuthContext);
    const {setAppBarState} = useContext(AppContext);
    const {notiData, refreshCount} = useContext(NotificationContext);
    const {showModooms, setShowModooms} = useContext(MainContext);
    const [modoomData, setModoomData] = useState([]);
    const [dmData, setDmData] = useState([]);
    const [loading, setLoading] = useState(false);
    useLayoutEffect(() => {
        setAppBarState({...defaultAppBarState, title: '대화', useBackButton: false, borderBottom: false})
    }, []);

    useEffect(() => {
        const source = axios.CancelToken.source();
        setLoading(true);
        axiosGet(source, urls().modoomChatRooms, {limit: 1000}).then(data => {
            setLoading(false);
            data && setModoomData(data.results);
        });
        axiosGet(source, urls().directChatRooms, {limit: 1000}).then(data => {
            data && setDmData(data.results)
        });
        refreshCount();
    }, [showModooms]);

    const unread_direct = notiData.direct_chat.reduce((prev, curr) => prev + curr.unread_count, 0)
    const unread_modoom = notiData.modoom_chat.reduce((prev, curr) => prev + curr.unread_count, 0)

    return (
        <Fragment>
            <NavigationTabContainer>
                <NavigationTab text={<span>모둠 {!!unread_modoom &&
                <UnreadBadge className='fs--1' unreadCount={unread_modoom}/>}</span>} active={showModooms}
                               onClick={() => setShowModooms(true)}/>
                <NavigationTab text={<span>DM {!!unread_direct &&
                <UnreadBadge className='fs--1' unreadCount={unread_direct}/>}</span>} active={!showModooms}
                               onClick={() => setShowModooms(false)}/>
            </NavigationTabContainer>
            {showModooms
                ? <ModoomVerticalList modoomData={modoomData}/>
                : <ProfileVerticalList dmData={dmData}/>}
            {showModooms
                ? loading || !!!modoomData.length && <ModoomNotFound className='mt-7'/>
                : !!!dmData.length && <DMNotFound className='mt-7'/>
            }
        </Fragment>
    );
};

export default ChatList;