import React, {useContext} from 'react';
import AppContext from "../context/Context";
import {Redirect, Route, Switch} from "react-router-dom";
import AppBarContainer from "../components/app-bars/AppBarContainer";
import {appUrls} from "../urls";
import Home from "../components/home/Home";
import CreateModoom from "../components/create/CreateModoom";
import CreatePost from "../components/create/CreatePost";
import Explore from "../components/explore/Explore";
import ExploreKeywordDetail from "../components/explore/explore-keyword/ExploreKeywordDetail";
import PageTabContainer from "../components/page-tabs/PageTabContainer";
import CreateTypeBottomSheet from "../components/create/CreateTypeBottomSheet";
import {toast, ToastContainer} from "react-toastify";
import {CloseButton, Fade} from "../components/common/Toast";
import ChatList from "../components/chat/chat-list/ChatList";
import ModoomChatRoutes from "../components/chat/ModoomChatRoutes";
import ProfileRoutes from "../components/profile/ProfileRoutes";
import ExploreKeywordFeeds from "../components/explore/explore-keyword/ExploreKeywordFeeds";
import FeedDetail from "../components/feeds/FeedDetail";
import Error404 from "../components/errors/Error404";
import GenericModal from "../components/modals/GenericModal";
import Notifications from "../components/notifications/Notifications";
import NotificationProvider from "../components/notifications/NotificationProvider";
import ExploreKeywordProfiles from "../components/explore/explore-keyword/ExploreKeywordProfiles";
import ErrorLayout from "./ErrorLayout";
import DirectChatRoutes from "../components/chat/DirectChatRoutes";
import EditModoom from "../components/create/EditModoom";
import Search from "../components/explore/search/Search";
import AddToHomeScreenSheet from "../components/common/AddToHomeScreenSheet";

const AppLayout = () => {
    const {isCreateBottomSheetOpen, setIsCreateBottomSheetOpen, appBarState, showAddToHomeScreen, setShowAddToHomeScreen} = useContext(AppContext);
    return (
        <NotificationProvider>
            <Route component={AppBarContainer}/>
            <div className='main-container' style={appBarState.hidden ? {top: '0'} : undefined}>
                <Switch>
                    <Route path={appUrls().home} exact component={Home}/>

                    <Route path={appUrls({nickname: ':nickname'}).profile} component={ProfileRoutes}/>

                    <Route path={appUrls().createModoom} exact component={CreateModoom}/>
                    <Route path={appUrls().createPost} exact component={CreatePost}/>

                    <Route path={appUrls().explore} exact component={Explore}/>
                    <Route path={appUrls().exploreSearch} exact component={Search}/>
                    <Route path={appUrls({feedId: ':feedId'}).feedDetail} exact component={FeedDetail}/>
                    <Route path={appUrls({modoomId: ':modoomId'}).modoomEdit} exact component={EditModoom}/>
                    <Route path={appUrls({keyword: ':keyword'}).exploreKeyword} exact component={ExploreKeywordDetail}/>
                    <Route path={appUrls({keyword: ':keyword'}).exploreKeywordProfiles}
                           component={ExploreKeywordProfiles}/>
                    <Route path={appUrls({keyword: ':keyword'}).exploreKeyword + '/:feedType'}
                           component={ExploreKeywordFeeds}/>

                    <Route path={appUrls().chats} exact component={ChatList}/>
                    <Route path={appUrls({nickname: ':nickname'}).chatsDirect} component={DirectChatRoutes}/>
                    <Route path={appUrls({modoomId: ':modoomId'}).chatsModoom} component={ModoomChatRoutes}/>

                    <Route path={appUrls().notifications} component={Notifications}/>
                    <Redirect to="/errors/404"/>
                </Switch>
            </div>
            <Switch>
                <Route path={appUrls({modoomId: ':modoomId'}).chatsModoom}/>
                <Route path={appUrls({nickname: ':nickname'}).chatsDirect}/>
                <Route path={appUrls({feedId: ''}).feedDetail}/>
                <Route component={PageTabContainer}/>
            </Switch>
            <AddToHomeScreenSheet title='모둠, 앱처럼 사용하기' isOpen={showAddToHomeScreen} setIsOpen={setShowAddToHomeScreen}/>
            <CreateTypeBottomSheet title={'만들기'} isOpen={isCreateBottomSheetOpen}
                                   setIsOpen={setIsCreateBottomSheetOpen}/>
        </NotificationProvider>
    )
};

export default AppLayout;