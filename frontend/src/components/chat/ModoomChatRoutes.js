import React from 'react';
import {Row, Col} from 'reactstrap';
import ModoomChatLayout from "./chat-room/modoom/ModoomChatLayout";
import ModoomChatProvider from "./chat-room/modoom/ModoomChatProvider";
import {Route, Switch} from "react-router-dom";
import {appUrls} from "../../urls";
import CreateChatRoom from "./chat-room/CreateChatRoom";
import ChatRoomInfo from "./chat-room/modoom/ChatRoomInfo";

const ModoomChatRoutes = ({match: {params: {modoomId}}}) => {
    return (
        <ModoomChatProvider modoomId={modoomId}>
            <Switch>
                <Route path={appUrls({modoomId}).chatsModoom} exact component={ModoomChatLayout}/>
                <Route path={appUrls({modoomId}).chatsModoomCreate} component={CreateChatRoom}/>
                <Route path={appUrls({modoomId}).chatsModoomInfo} component={ChatRoomInfo}/>
            </Switch>
        </ModoomChatProvider>
    );
};

export default ModoomChatRoutes;