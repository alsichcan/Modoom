import React, {useContext, useEffect, useState} from 'react';
import {Row, Col} from 'reactstrap';
import InteractionButton from "../common/InteractionButton";
import urls, {appUrls} from "../../urls";
import {axiosDelete, axiosGet, axiosPost} from "../../actions/axios";
import axios from "axios";
import AppContext from "../../context/Context";
import {defaultModalState} from "../../Main";
import {useGA4React} from "ga-4-react";

const FriendButton = ({nickname}) => {
    const [type, setType] = useState(3);
    const {setModalState} = useContext(AppContext);
    const ga = useGA4React();

    useEffect(() => {
        const source = axios.CancelToken.source();
        axiosGet(source, urls({nickname}).friend).then(data => {
            data?.success && setType(data.data.type);
        });
    }, []);

    const withModal = (state) => () => {
        setModalState({...defaultModalState, ...state});
    };

    const onDeleteFriend = () => {
        axiosDelete(null, urls({nickname}).friend).then(data => {
            if (data?.success) {
                setType(3)
            }
        });
    };

    const onAcceptRequest = () => {
        axiosDelete(null, urls({nickname, command: 'accept'}).friendRequest).then(data => {
            if (data?.success) {
                setType(0);
            }
        });
    };

    const onDeclineRequest = () => {
        axiosDelete(null, urls({nickname, command: 'decline'}).friendRequest).then(data => {
            if (data?.success) {
                setType(3);
            }
        });
    };

    const onCancelRequest = () => {
        axiosDelete(null, urls({nickname, command: 'cancel'}).friendRequest).then(data => {
            if (data?.success) {
                setType(3);
            }
        });
    };

    const onSendRequest = () => {
        axiosPost(null, urls({nickname, command: 'send'}).friendRequest).then(data => {
            if (data?.success) {
                setType(1);
                ga.gtag('event', 'request', {
                    'event_category': 'friendship',
                    'event_label': nickname,
                });
            }
        });
    };

    switch (type) {
        case 0:  // 친구
            return <InteractionButton text='친구 사이' className='py-1' icon='Smile' fill
                                      onClick={withModal({
                                          title: '친구를 삭제하시겠습니까?',
                                          confirmText: <span className='text-danger'>삭제</span>,
                                          onConfirm: onDeleteFriend,
                                          isOpen: true
                                      })}
            />
        case 1:  // 친구 신청 보냄
            return <InteractionButton text='친구 신청됨' className='py-1' icon='Check' highlight
                                      onClick={withModal({
                                          title: '친구 신청을 취소하시겠습니까?',
                                          onConfirm: onCancelRequest,
                                          isOpen: true
                                      })}
            />
        case 2:  // 친구 신청 받음
            return <InteractionButton text='응답' className='py-1' icon='UserCheck' fill
                                      onClick={withModal({
                                          title: '친구 신청을 수락하시겠습니까?',
                                          confirmText: '수락',
                                          dismissText: '거절',
                                          onConfirm: onAcceptRequest,
                                          onDismiss: onDeclineRequest,
                                          isOpen: true
                                      })}
            />
        case 3:  // 남
            return <InteractionButton text='친구 신청' className='py-1' icon='UserPlus' highlight
                                      onClick={onSendRequest}
            />
        default:
            return null
    }
};

const OtherProfileButtons = ({nickname}) => {

    return (
        <Row noGutters>
            <Col className='pr-3'>
                <InteractionButton text='메시지 보내기' className='py-1' icon='Send'
                                   to={appUrls({nickname}).chatsDirect}/>
            </Col>
            <Col>
                <FriendButton nickname={nickname}/>
            </Col>
        </Row>
    );
};

export default OtherProfileButtons;