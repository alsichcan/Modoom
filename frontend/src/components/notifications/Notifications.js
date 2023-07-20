import React, {Fragment, useContext, useEffect, useLayoutEffect, useState} from 'react';
import {Row, Col} from 'reactstrap';
import AppContext, {NotificationContext} from "../../context/Context";
import {defaultAppBarState} from "../../Main";
import Notification from "./Notification";
import Helmet from "react-helmet";
import InteractionButton from "../common/InteractionButton";
import {axiosGet, axiosPatch} from "../../actions/axios";
import urls from "../../urls";
import {useInView} from "react-intersection-observer";

const Notifications = () => {
    const {setAppBarState} = useContext(AppContext);
    const {notifications, setNotifications, refreshNoti, nextUrl, setNextUrl,setUnreadCount} = useContext(NotificationContext);
    const [ref, inView] = useInView({rootMargin: '100px 0px'})

    useLayoutEffect(() => {
        setAppBarState({
            ...defaultAppBarState,
            useLogo: false,
            title: '알림',
            useBackButton: true,
            useNotification: false
        })
        refreshNoti();
    }, [])

    useEffect(() => {
        if (inView && nextUrl) {
            axiosGet(null, nextUrl).then(data => {
                if (data) {
                    setNotifications([...notifications, ...data.results]);
                    setNextUrl(data.next);
                }
            });
        }
    }, [inView]);

    const onCommand = (command) => () => {
        axiosPatch(null, urls({command: command}).notificationsUpdate).then(data => {
            if (data?.success) {
                setUnreadCount(0);
                refreshNoti();
            }
        });
    };

    return (
        <Fragment>
            <Helmet bodyAttributes={{style: 'background-color : #fff'}}/>
            <div className='container'>
                <Row className='d-flex justify-content-end mt-3'>
                    <Col className='col-auto pr-0'>
                        <InteractionButton text='전체 삭제' className='py-1' onClick={onCommand('delete')}
                                           disabled={!!!notifications.length}/>
                    </Col>
                    <Col className='col-auto'>
                        <InteractionButton text='모두 읽음' className='py-1' fill onClick={onCommand('read')}
                                           disabled={!!!notifications.length}/>
                    </Col>
                </Row>
            </div>
            <div className='py-1'/>
            {notifications.map((notification, index) => {
                return <Notification key={notification.id} notification={notification}/>
            })}
            <div ref={ref}/>
        </Fragment>
    );
};

export default Notifications;