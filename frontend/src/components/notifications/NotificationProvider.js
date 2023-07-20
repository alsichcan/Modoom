import React, {useContext, useEffect, useState} from 'react';
import {Row, Col} from 'reactstrap';
import {NotificationContext} from "../../context/Context";
import {axiosGet} from "../../actions/axios";
import urls from "../../urls";
import {useInterval} from "../../hooks/useInterval";
import useDidMountEffect from "../../hooks/useDidMountEffect";

const NotificationProvider = ({children}) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [nextUrl, setNextUrl] = useState(null);
    const [toggleNoti, setToggleNoti] = useState(false);
    const [toggleCount, setToggleCount] = useState(false);
    const [notiData, setNotiData] = useState({
        n_notifications: 0,
        n_unread_messages: 0,
        direct_chat: [],
        modoom_chat: []
    });

    const refreshNoti = () => {
        setToggleNoti(!toggleNoti);
    };

    const refreshCount = () => {
        setToggleCount(!toggleCount);
    };

    const updateCount = () => {
        axiosGet(null, urls().notificationsCount).then(data => {
            if (data?.data) {
                setNotiData(data.data);
                setUnreadCount(data.data.n_notifications || 0);
            }
        });
    };

    useInterval(() => {
        updateCount();
    }, 1000 * 10);

    useEffect(() => {
        updateCount();
    }, [toggleCount]);

    useDidMountEffect(() => {
        axiosGet(null, urls().notificationsList).then(data => {
            if (data) {
                setNotifications(data.results);
                setNextUrl(data.next);
            }
        });
    }, [toggleNoti]);

    const value = {
        notifications,
        setNotifications,
        nextUrl,
        setNextUrl,
        unreadCount,
        refreshNoti,
        refreshCount,
        setUnreadCount,
        notiData
    }
    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;