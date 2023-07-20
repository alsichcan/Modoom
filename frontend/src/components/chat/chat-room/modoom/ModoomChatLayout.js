import React, {Fragment, useContext, useEffect} from 'react';
import classNames from 'classnames'
import AppContext, {ChatContext} from "../../../../context/Context";
import Helmet from "react-helmet";
import ChatRoom from "./ChatRoom";
import {useHistory} from "react-router-dom";
import urls, {appUrls, webSocketUrls} from "../../../../urls";

const ChannelButton = ({name, active, onClick, className, children}) => {
    return (
        <div onClick={onClick}
             className={classNames('d-inline-block text-center font-weight-medium pb-2 px-0 text-700 cursor-pointer user-select-none', {
                 'menu-active text-primary': active,
                 [className]: !!className
             })}>
            {children || name}
        </div>
    )
};

const ModoomChatLayout = () => {
    const {appBarState, setAppBarState} = useContext(AppContext);
    const {modoomId, modoom, rooms, activeRoom, isLeader} = useContext(ChatContext);
    const history = useHistory();

    useEffect(() => {
        setAppBarState({
            ...appBarState,
            title: <span>{modoom?.title || appBarState.title}</span>,
            useLogo: false,
            useBackButton: true,
            useNotification: false,
            useInfo: true,
            infoUrl: appUrls({modoomId}).chatsModoomInfo,
            infoCount: isLeader ? modoom?.enrollments?.reduce((prev, curr) => prev + (!curr.accepted ? 1 : 0), 0) : 0
        })
    }, [modoom, activeRoom]);

    return (
        <Fragment>
            <Helmet bodyAttributes={{style: 'background-color : #f9fafd'}}/>
            {activeRoom && <ChatRoom messagesAPI={urls({id: activeRoom.id}).modoomMessages}
                                     webSocketAPI={webSocketUrls({id: activeRoom.id}).modoomRoom}/>}
        </Fragment>
    );
};

export default ModoomChatLayout;