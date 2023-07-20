import React from 'react';
import {Row, Col} from 'reactstrap';
import Avatar from "../common/Avatar";
import classNames from "classnames";
import urls, {appUrls} from "../../urls";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/free-solid-svg-icons/faCircle";
import {useHistory} from 'react-router-dom';
import {axiosPatch} from "../../actions/axios";
import ProfileAvatar from "../common/ProfileAvatar";
import TruncatedText from "../feeds/TruncatedText";
import Moment from "react-moment";

const Notification = ({notification, isLast}) => {
    const profile = notification.actor;
    const history = useHistory();
    if (profile === null) { // TODO 리뷰 요청 알림 대응
        return null;
    }
    let appUrl;
    switch (notification.target) {
        case 'chat':
            appUrl = appUrls({modoomId: notification.target_id}).chatsModoomInfo;
            break;
        case 'modoom':
            appUrl = appUrls({feedId: notification.target_id}).feedDetail;
            break;
        case 'profile':
            appUrl = appUrls({nickname: profile.nickname}).profile;
            break;
    }
    const onClick = () => {
        axiosPatch(null, urls({command: 'read', id: notification.id}).notificationsUpdate)
        history.push(appUrl);
    };
    return (
        <div className='container'>
            <Row noGutters>
                <Col className='col-auto d-flex align-items-center'>
                    <FontAwesomeIcon icon={faCircle}
                                     className={classNames('text-primary align-middle mx-1', {'visibility-hidden': !notification.unread})}
                                     transform='shrink-6'/>
                    <ProfileAvatar className='mr-2' profile={profile} useLink
                                   size='2xl'/>

                </Col>
                <Col className={'my-auto cursor-pointer'} onClick={onClick}>
                    <div className='text-900 font-weight-medium fs--1'>
                        <span className='font-weight-semi-bold text-900'>
                            {profile?.full_name}
                        </span>
                        {notification.action}
                    </div>
                    <div className='fs--1'>
                        <TruncatedText lines={2} useReadMore={false}>
                            {notification.description}
                        </TruncatedText>
                    </div>
                    <Moment locale='ko' fromNow className='fs--2'>{notification.timestamp}</Moment>
                </Col>
            </Row>
            <hr className={classNames('my-2', {
                'border-200': !isLast,
                'border-0': isLast
            })}/>
        </div>
    );
};

export default Notification;