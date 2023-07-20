import React, {Fragment, useEffect, useState} from 'react';
import {Row, Col} from 'reactstrap';
import {ChatContext} from "../../../../context/Context";
import axios from "axios";
import {axiosGet, axiosPost} from "../../../../actions/axios";
import urls from "../../../../urls";

const DirectChatProvider = ({children, nickname}) => {
    const [profile, setProfile] = useState(null);
    const [activeRoom, setActiveRoom] = useState(null);

    useEffect(() => {
        const source = axios.CancelToken.source();
        axiosPost(source, urls().directChatRooms, {nickname: nickname}).then(data => {
            if (data?.success) {
                setActiveRoom(data.data.room);
                setProfile(data.data.profile);
            }
        });
        return () => {
            source.cancel();
        };
    }, []);

    const value = {nickname, profile, activeRoom}
    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

export default DirectChatProvider;