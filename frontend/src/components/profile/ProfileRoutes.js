import React from 'react';
import ProfileProvider from "./ProfileProvider";
import {Route, Switch} from "react-router-dom";
import {appUrls} from "../../urls";
import Profile from "./Profile";
import ProfileEdit from "./profile-edit/ProfileEdit";
import Error404 from "../errors/Error404";
import Friends from "../relationships/Friends";
import Modoomees from "../relationships/Modoomees";

const ProfileRoutes = ({match: {params: {nickname}}}) => {
    return (
        <ProfileProvider nickname={nickname}>
            <Switch>
                <Route path={appUrls({nickname}).profile} exact component={Profile}/>
                <Route path={appUrls({nickname}).profileEdit} component={ProfileEdit}/>
                <Route path={appUrls({nickname}).profileFriends} component={Friends}/>
                <Route path={appUrls({nickname}).profileModoomees} component={Modoomees}/>
                {/*<Route path={appUrls({modoomId}).chatsModoomCreate} component={CreateChatRoom}/>*/}
                <Route component={Error404}/>
            </Switch>
        </ProfileProvider>
    );
};

export default ProfileRoutes;