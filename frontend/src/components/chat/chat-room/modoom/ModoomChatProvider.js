import React, {useContext, useEffect, useState} from 'react';
import {AuthContext, ChatContext} from "../../../../context/Context";
import axios from "axios";
import {axiosGet} from "../../../../actions/axios";
import urls, {appUrls} from "../../../../urls";
import {checkRedirect404} from "../../../../helpers/utils";
import {useHistory} from 'react-router-dom';

const ModoomChatProvider = ({children, modoomId}) => {
    const {authState} = useContext(AuthContext);
    const history = useHistory();
    const [modoom, setModoom] = useState(null);
    const [enrollments, setEnrollments] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [activeRoom, setActiveRoom] = useState({id: modoomId});
    const [toggleRefreshRooms, setToggle] = useState(false);
    const [toggleModoom, setToggleModoom] = useState(false);
    const isLeader = !!modoom?.enrollments?.find(e => e.profile.nickname === authState.user.nickname)?.is_leader;

    const refreshRooms = () => {
        setToggle(!toggleRefreshRooms);
    };

    const refreshModoom = () => {
        setToggleModoom(!toggleModoom);
    };

    useEffect(() => {
        const source = axios.CancelToken.source();
        axiosGet(source, urls({modoomId}).modoom).then(data => {
            if (data) {
                if (!!!data.enrollments?.find(e => (e.profile.nickname === authState.user.nickname) && e.accepted)) {
                    history.push(appUrls().error404)
                }
                setModoom(data);
            }
        });
        axiosGet(source, urls({modoomId}).modoomEnrollments).then(data => {
            if (data) {
                setEnrollments(data.results);
            }
        });
        return () => {
            source.cancel();
        };
    }, [toggleModoom]);



    // 채널 목록을 새로고침한다.
    // useEffect(() => {
    //     const source = axios.CancelToken.source();
    //     axiosGet(source, urls().modoomChatRooms).then(data => {
    //         setRooms(data?.results);
    //         setActiveRoom(data?.results[0]?.chat_room)
    //     });
    //     return () => {
    //         source.cancel();
    //     };
    // }, [toggleRefreshRooms]);

    const value = {modoomId, modoom, rooms, activeRoom, setActiveRoom, refreshRooms, refreshModoom, isLeader,enrollments};
    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ModoomChatProvider;