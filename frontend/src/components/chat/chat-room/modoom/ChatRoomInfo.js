import React, {Fragment, useContext, useEffect, useLayoutEffect, useState} from 'react';
import {Badge, Col, Label, Row} from 'reactstrap';
import Helmet from "react-helmet";
import AppContext, {AuthContext, ChatContext} from "../../../../context/Context";
import {defaultAppBarState, defaultModalState} from "../../../../Main";
import Avatar from "../../../common/Avatar";
import InteractionButton from "../../../common/InteractionButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHashtag} from "@fortawesome/free-solid-svg-icons/faHashtag";
import classNames from 'classnames';
import urls, {appUrls} from "../../../../urls";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import {Link, useHistory} from 'react-router-dom';
import {isIterableArray} from "../../../../helpers/utils";
import {axiosDelete, axiosGet, axiosPatch} from "../../../../actions/axios";
import axios from 'axios';
import {toast} from "react-toastify";
import ProfileAvatar from "../../../common/ProfileAvatar";
import TruncatedText from "../../../feeds/TruncatedText";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons/faArrowRight";

const ModoomeeVerticalListItem = ({enrollment, refresh}) => {
    const {authState} = useContext(AuthContext);
    const {modoomId, modoom} = useContext(ChatContext);
    const {setModalState} = useContext(AppContext);
    const profile = enrollment.profile;
    const [loading, setLoading] = useState(false);
    const iAmLeader = authState.user.uid === modoom?.profile?.uid;

    const onApprove = () => {
        setLoading(true);
        axiosPatch(null, urls({modoomId}).modoomEnrollments, {nickname: profile.nickname}).then(data => {
            setLoading(false);
            if (data?.success) {
                refresh();
                toast(
                    <Fragment>
                        <strong>{profile.full_name}</strong>님이 모둠에 가입되었습니다. 환영해주세요! 🎉
                    </Fragment>
                );
            } else {
                toast.error(data?.message);
            }
        });
    };

    const onDisapprove = (kick = false) => () => {
        setLoading(true);
        axiosDelete(null, urls({modoomId}).modoomEnrollments, {
            nickname: profile.nickname,
            kick: kick
        }).then(data => {
            setLoading(false);
            if (data?.success) {
                refresh();
            }
        });
    };

    const withModal = (title, onClick) => () => {
        setModalState({...defaultModalState, title: title, isOpen: true, onConfirm: onClick})
    };
    return (
        <div>
            <Row noGutters className='mt-2 mb-3'>
                <Col className='col-auto pr-3 '>
                    <Link className='d-flex align-items-center' to={appUrls({nickname: profile.nickname}).profile}>
                        <ProfileAvatar profile={profile}
                                       size='3xl'
                                       style={{width: '3rem', height: '3rem'}}
                        />
                    </Link>
                </Col>
                <Col className='my-auto'>
                    <Link className='fs--1 text-900' to={appUrls({nickname: profile.nickname}).profile}>
                        <span className='align-middle'>{profile.full_name}</span>
                        {enrollment.is_leader &&
                        <Badge className='align-middle px-1 ml-1' color='soft-danger'>모둠장</Badge>}
                    </Link>
                    {iAmLeader && !enrollment.accepted &&
                    <TruncatedText className='fs--2 text-700 bg-200 p-2 border-radius-1 mt-1' lines={0}>
                        {enrollment.message || '작성한 가입 신청 메시지가 없습니다.'}
                    </TruncatedText>}
                    {iAmLeader && !enrollment.accepted && <div className='d-flex justify-content-end mt-2'>
                        <InteractionButton text={'거절'} className={'mx-2 py-1'} isLoading={loading}
                                           onClick={withModal('가입을 거절하시겠습니까?', onDisapprove(false))}/>
                        <InteractionButton text={'승인'} className='py-1' fill onClick={withModal('가입을 승인하시겠습니까?', onApprove)}
                                           isLoading={loading}/>
                    </div>}
                </Col>
                {iAmLeader && <Col className='col-auto my-auto'>
                    <div className='d-flex'>
                        {!enrollment.is_leader && enrollment.accepted && <Fragment>
                            <InteractionButton text={'내보내기'} className={'py-1 mx-2 text-danger'} isLoading={loading}
                                               onClick={withModal('모둠에서 내보내시겠습니까?', onDisapprove(true))}/>
                        </Fragment>}
                    </div>
                </Col>}
            </Row>
        </div>
    );
};

const RoomVerticalListItem = ({room, active, onClick}) => {
    return <div onClick={onClick} className={classNames('cursor-pointer d-flex align-items-center mt-1 p-1', {
        'bg-soft-primary text-primary': active
    })}>
        <FontAwesomeIcon icon={faHashtag} fixedWidth className='mr-1 align-middle'/>
        <div className='align-middle'>{room.name}</div>
    </div>
};

const ChatRoomInfo = () => {
    const {authState} = useContext(AuthContext);
    const {setAppBarState, setModalState} = useContext(AppContext);
    const {modoomId, modoom, rooms, activeRoom, isLeader, refreshModoom, enrollments} = useContext(ChatContext);
    const [toggleEnrollments, setToggle] = useState(false);
    const history = useHistory()
    const acceptedEnrollments = enrollments?.filter(enrollment => enrollment.accepted);
    const pendingEnrollments = enrollments?.filter(enrollment => !enrollment.accepted);

    const withModal = (title, onClick) => () => {
        setModalState({...defaultModalState, title, onConfirm: onClick, isOpen: true})
    };

    const callback = data => {
        if (data?.success) {
            history.push(appUrls().chats)
        }
        toast(data?.message);
    };
    const onDelete = () => {
        axiosDelete(null, urls({modoomId}).modoom).then(callback);
    };

    const onTerminate = () => {
        axiosPatch(null, urls({modoomId}).modoom, {ongoing: false}).then(callback)
    };

    const onLeave = () => {
        axiosDelete(null, urls({id: modoomId}).modoomEnroll).then(callback);
    };

    useLayoutEffect(() => {
        setAppBarState({...defaultAppBarState, title: '모둠 상세정보', useBackButton: true, useNotification: false})
    }, []);

    return (
        <div className='container py-3'>
            <Helmet bodyAttributes={{style: 'background-color : #fff'}}/>
            <div className='px-2'>
                <Label>
                    모둠 이름
                </Label>
                <div className='font-weight-medium text-900'>
                    {modoom?.title}
                </div>
            </div>
            <hr className='border-300'/>
            <div className='px-2'>
                <Label>
                    내용
                    <Link className='ml-1' to={appUrls({feedId: modoomId}).feedDetail}>
                        <FontAwesomeIcon icon={faArrowRight} transform='shrink-5'/>
                        게시글에서 보기
                    </Link>
                </Label>
                <div className='fs--1 font-weight-medium text-800'>
                    {modoom && <TruncatedText preserveNewline lines={3}>
                        {modoom?.content}
                    </TruncatedText>}
                </div>
            </div>
            {/*<div className='px-2'>*/}
            {/*    <Label>*/}
            {/*        채널*/}
            {/*    </Label>*/}
            {/*    <div className='font-weight-medium text-900'>*/}
            {/*        {rooms?.map(room => {*/}
            {/*            return <RoomVerticalListItem key={room.id} room={room} active={room.id === activeRoom.id}*/}
            {/*                                         onClick={() => setActiveRoom(room)}/>*/}
            {/*        })}*/}
            {/*        <div onClick={() => {*/}
            {/*            history.push(appUrls({modoomId: modoomId}).chatsModoomCreate)*/}
            {/*        }} className={classNames('cursor-pointer d-flex align-items-center mt-1 p-1 text-800')}>*/}
            {/*            <FontAwesomeIcon icon={faPlus} fixedWidth className='mr-1 align-middle'/>*/}
            {/*            <div className='align-middle'>채널 추가</div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <hr className='border-300'/>
            <div className='px-2'>
                <Label>
                    모둠원 ({acceptedEnrollments?.length || '-'}/{modoom?.accom}명)
                </Label>
                <div className='font-weight-medium'>
                    {acceptedEnrollments?.map(enrollment => {
                        return <ModoomeeVerticalListItem key={enrollment.id} enrollment={enrollment}
                                                         refresh={refreshModoom}/>
                    })}
                </div>
            </div>
            {isLeader && isIterableArray(pendingEnrollments) && <Fragment>
                <hr className='border-300'/>
                <div className='px-2'>
                    <Label>
                        가입 대기중인 모둠원 ({pendingEnrollments?.length || '-'}명)
                    </Label>
                    <div className='font-weight-medium'>
                        {pendingEnrollments.map(enrollment => {
                            return <ModoomeeVerticalListItem key={enrollment.id} enrollment={enrollment}
                                                             refresh={refreshModoom}/>
                        })}
                    </div>
                </div>
            </Fragment>}
            <div className='mt-4'>
                <InteractionButton text='채팅방으로 돌아가기'
                                   fill
                                   className='py-1 font-weight-medium mb-2'
                                   onClick={() => history.replace(appUrls({modoomId}).chatsModoom)}
                />
                {isLeader && <InteractionButton text='모둠 수정하기'
                                                className='py-1 font-weight-medium mb-2'
                                                onClick={() => history.replace(appUrls({modoomId}).modoomEdit)}
                />}
                {isLeader && <InteractionButton text={modoom.deletable ? '모둠 삭제하기' : '모둠 종료하기'}
                                                onClick={modoom.deletable
                                                    ? withModal('정말 삭제하시겠습니까?', onDelete)
                                                    : withModal('정말 종료하시겠습니까?', onTerminate)}
                                                className='text-danger py-1 font-weight-medium'/>}
                {isLeader || <InteractionButton text='모둠 나가기'
                                                className='text-danger py-1 font-weight-medium'
                                                onClick={withModal('정말 나가시겠습니까?', onLeave)}
                />}
            </div>
        </div>
    );
};

export default ChatRoomInfo;