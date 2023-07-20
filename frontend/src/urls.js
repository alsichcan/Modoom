import {isDev} from "./helpers/utils";

const prodHost = 'api.modoom.us';
const devHost = '127.0.0.1:8000';

let baseAPI;
let baseWebsocket;
if (isDev()) {
    // dev
    baseAPI = `http://${devHost}`;
    baseWebsocket = `ws://${devHost}/ws`;
} else {
    // production
    baseAPI = `https://${prodHost}`;
    baseWebsocket = `wss://${prodHost}/ws`;
}

const usersUrl = `${baseAPI}/users`;
const chatsUrl = `${baseAPI}/chats`;
const keywordsUrl = `${baseAPI}/keywords`;
const notificationsUrl = `${baseAPI}/notifications`;
const relationshipsUrl = `${baseAPI}/relationships`;
const modoomsUrl = `${baseAPI}`;

const urls = ({modoomId, nickname, roomId, keyword, postId, feedId, id,command} = {}) => {
    // 주의: 마지막 '/' 반드시 붙여야한다!
    return {
        subscribe: `${usersUrl}/subscribe/`,

        verifyEmail: `${usersUrl}/verify/email/`,
        verifyCode: `${usersUrl}/verify/code/`,
        verifyEmailReset: `${usersUrl}/verify/email/reset/`,
        verifyCodeReset: `${usersUrl}/verify/code/reset/`,
        resetPassword: `${usersUrl}/reset/password/`,
        changePassword: `${usersUrl}/change/password/`,
        findUsername: `${usersUrl}/find/username/`,
        validate: `${usersUrl}/validate/`,
        register: `${usersUrl}/register/`,
        logout: `${usersUrl}/logout/`,
        login: `${usersUrl}/login/`,
        authenticate: `${usersUrl}/authenticate/`,
        profileDetail: `${usersUrl}/${nickname}/detail/`,

        feeds: `${modoomsUrl}/home/`,
        feed: `${modoomsUrl}/modoom/${feedId}/`,
        search: `${modoomsUrl}/search/`,

        exploreModooms: `${modoomsUrl}/explore/modooms/`,
        explorePosts: `${modoomsUrl}/explore/posts/`,

        modoom: `${modoomsUrl}/modoom/${modoomId ? modoomId + '/' : ''}`,
        modooms: `${modoomsUrl}/${nickname}/modooms/`,
        post: `${modoomsUrl}/post/${postId ? postId + '/' : ''}`,
        posts: `${modoomsUrl}/${nickname}/posts/`,
        likeFeed:`${modoomsUrl}/like/modoom/${feedId}/`,
        commentFeed:`${modoomsUrl}/comment/modoom/${id}/`,
        commentComment:`${modoomsUrl}/comment/comment/${id}/`,
        commentSubcomment:`${modoomsUrl}/comment/subcomment/${id}/`,
        modoomEnroll: `${modoomsUrl}/modoom/${id}/enroll/`,
        modoomEnrollments: `${modoomsUrl}/modoom/${modoomId}/enrollments/`,
        count: `${modoomsUrl}/count/`,

        keywords: `${keywordsUrl}/`,
        keywordsProfiles: `${keywordsUrl}/${keyword}/profiles/`,
        keywordsModooms: `${keywordsUrl}/${keyword}/modooms/`,
        keywordsPosts: `${keywordsUrl}/${keyword}/posts/`,
        keywordsAdd: `${keywordsUrl}/${keyword}/add/`,

        modoomChatRooms: `${chatsUrl}/modoom/rooms/`,
        directChatRooms: `${chatsUrl}/direct/rooms/`,

        modoomMessages: `${chatsUrl}/messages/modoom/${id}/`,
        directMessages: `${chatsUrl}/messages/direct/${id}/`,

        notificationsCount : `${notificationsUrl}/count/`,
        notificationsList : `${notificationsUrl}/list/`,
        notificationsUpdate : `${notificationsUrl}/${command}/${id ? id + '/' : ''}`,

        friend : `${relationshipsUrl}/friend/${nickname}/`,
        friends: `${relationshipsUrl}/${nickname}/friends/`,
        friendRequest : `${relationshipsUrl}/friend/request/${nickname}/${command}/`,
        modoomees: `${relationshipsUrl}/${nickname}/modoomees/`,
    }
};

export default urls;


export const webSocketUrls = ({id} = {}) => {
    return {
        modoomRoom: `${baseWebsocket}/chats/modoom/${id}/`,
        directRoom: `${baseWebsocket}/chats/direct/${id}/`
    }
};


const appPrefix = ''

export const appUrls = ({feedId, modoomId, nickname, keyword, postId} = {}) => {
    return {

        // 인증 모듈
        login: '/auth/login',
        passwordReset: '/auth/forgot/password',
        forgotUsername: '/auth/forgot/username',
        register: '/auth/register',
        registerComplete: '/auth/register/complete',

        // 홈
        home: `${appPrefix}/`,

        // 이용약관
        terms: `${appPrefix}/policies/terms`,
        privacy: `${appPrefix}/policies/privacy`,

        // 탐색
        explore: `${appPrefix}/explore`,
        exploreSearch: `${appPrefix}/explore/search`,
        exploreKeyword: `${appPrefix}/explore/${keyword}`,
        exploreKeywordProfiles: `${appPrefix}/explore/${keyword}/profiles`,
        exploreKeywordModooms: `${appPrefix}/explore/${keyword}/modooms`,
        exploreKeywordPosts: `${appPrefix}/explore/${keyword}/posts`,

        feedDetail: `${appPrefix}/modoom/${feedId}`,
        modoomEdit: `${appPrefix}/modoom/${modoomId}/edit`,

        // to be deprecated
        // modoomDetail: `${appPrefix}/modooms/${modoomId}`,
        // pollDetail: `${appPrefix}/polls/${postId}`,

        // 개설
        create: `${appPrefix}/create`,
        createModoom: `${appPrefix}/create/modoom`,
        createPost: `${appPrefix}/create/post`,

        // 채팅
        chats: `${appPrefix}/chats`,
        chatsDirect: `${appPrefix}/chats/direct/${nickname}`,
        chatsModoom: `${appPrefix}/chats/modoom/${modoomId}`,
        chatsModoomInfo: `${appPrefix}/chats/modoom/${modoomId}/info`,
        chatsModoomCreate: `${appPrefix}/chats/modoom/${modoomId}/create`,

        // 나의 프로필
        profile: `${appPrefix}/profile/${nickname || ''}`,
        profileFriends: `${appPrefix}/profile/${nickname}/friends`,
        profileModoomees: `${appPrefix}/profile/${nickname}/modoomees`,
        profileEdit: `${appPrefix}/profile/${nickname}/edit`,

        // 알림
        notifications: `${appPrefix}/notifications`,

        // 에러
        error404: `${appPrefix}/errors/404`,
        error500: `${appPrefix}/errors/500`,
    };
};