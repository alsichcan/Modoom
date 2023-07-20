import React, {Fragment, useContext, useEffect, useLayoutEffect} from 'react';
import {Row, Col} from 'reactstrap';
import AppContext, {ChatContext} from "../../../../context/Context";
import Helmet from "react-helmet";
import ChatRoom from "../modoom/ChatRoom";
import urls, {webSocketUrls} from "../../../../urls";

const DirectChatLayout = () => {
    const {appBarState, setAppBarState} = useContext(AppContext);
    const {nickname, profile, activeRoom} = useContext(ChatContext);

    useLayoutEffect(() => {
        setAppBarState({
            ...appBarState,
            title: profile && profile.full_name,
            useLogo: false,
            useBackButton: true,
            useNotification: false,
        })
    }, [profile]);

    return (
        <Fragment>
            <Helmet bodyAttributes={{style: 'background-color : #f9fafd'}}/>
            {activeRoom && <ChatRoom messagesAPI={urls({id: activeRoom.id}).directMessages} webSocketAPI={webSocketUrls({id: activeRoom.id}).directRoom}/>}
        </Fragment>
    );
};

export default DirectChatLayout;