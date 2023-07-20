import React from 'react';
import {appUrls} from "../../urls";

export const tabs = [
    {
        name: '홈',
        icon: 'Home',
        url: appUrls().home,
        strict: true
    },
    {
        name: '탐색',
        icon: 'Compass',
        url: appUrls().explore
    },
    {
        name: '개설',
        icon: 'PlusCircle',
        url: appUrls().createModoom,
        // asPopUp: true
    },
    {
        name: '채팅',
        icon: 'MessageCircle',
        url: appUrls().chats
    },
    {
        name: '프로필',
        icon: 'User',
        url: appUrls().profile
    }
]