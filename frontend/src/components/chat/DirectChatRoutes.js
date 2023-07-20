import React from 'react';
import {Row, Col} from 'reactstrap';
import ModoomChatLayout from "./chat-room/modoom/ModoomChatLayout";
import ModoomChatProvider from "./chat-room/modoom/ModoomChatProvider";
import {Route, Switch} from "react-router-dom";
import {appUrls} from "../../urls";
import CreateChatRoom from "./chat-room/CreateChatRoom";
import ChatRoomInfo from "./chat-room/modoom/ChatRoomInfo";
import DirectChatProvider from "./chat-room/direct/DirectChatProvider";
import DirectChatLayout from "./chat-room/direct/DirectChatLayout";

const DirectChatRoutes = ({match: {params: {nickname}}}) => {
    return (
        <DirectChatProvider nickname={nickname}>
            <Switch>
                <Route path={appUrls({nickname}).chatsDirect} exact component={DirectChatLayout}/>
                {/*<Route path={appUrls({modoomId}).chatsModoomCreate} component={CreateChatRoom}/>*/}
                {/*<Route path={appUrls({modoomId}).chatsModoomInfo} component={ChatRoomInfo}/>*/}
            </Switch>
        </DirectChatProvider>
    );
};

export default DirectChatRoutes;