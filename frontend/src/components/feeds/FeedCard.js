import React, {Fragment, useContext, useEffect, useState} from 'react';
import {Badge, Col, Input, Row} from 'reactstrap';
import CardSection from "../common/CardSection";
import {MapPin, Users} from "react-feather";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart} from "@fortawesome/free-solid-svg-icons/faHeart";
import {Link, useHistory} from 'react-router-dom';
import classNames from 'classnames';
import urls, {appUrls} from "../../urls";
import ModoomProfileGroup from "./ModoomProfileGroup";
import InteractionButton from "../common/InteractionButton";
import {faHeart as farHeart} from "@fortawesome/free-regular-svg-icons/faHeart";
import {axiosDelete, axiosPatch, axiosPost} from "../../actions/axios";
import AppContext, {AuthContext, FeedDetailContext} from "../../context/Context";
import {toast} from "react-toastify";
import {defaultModalState} from "../../Main";
import ProfileAvatar from "../common/ProfileAvatar";
import KeywordBadge from "../common/KeywordBadge";
import Moment from "react-moment";
import {useGA4React} from "ga-4-react";
import {faEye} from "@fortawesome/free-solid-svg-icons/faEye";

const PostCardWrapper = ({itemOnly, children}) => {
    if (itemOnly) {
        return <Fragment>{children}</Fragment>;
    } else {
        return <CardSection hasPadding={false}>{children}</CardSection>;
    }
};

const EnrollMessageInput = ({setMessage}) => {
    return <Input
        type='textarea'
        name='introduction'
        rows={6}
        placeholder="좋은 첫인상을 남겨보아요."
        autoComplete='off'
        onChange={({target}) => {
            setMessage(target.value);
        }}
        className={classNames('modoom-form-control')}
    />
};


const FeedCard = ({feed, itemOnly, showDetail, useLink, likes, hideProfile, truncateLines}) => {
    const {authState} = useContext(AuthContext);
    const {setModalState, modalState} = useContext(AppContext);
    const [loadingEnroll, setLoadingEnroll] = useState(false);
    const [enrollMsg, setEnrollMsg] = useState('');
    const {feedId, refreshFeed, isLiked, setIsLiked, setLikes} = useContext(FeedDetailContext);
    const history = useHistory();
    const uploaderProfile = feed.profile;
    const myEnrollment = feed.enrollments?.find(enrollment => enrollment.profile.nickname === authState.user.nickname);
    const accepted = myEnrollment?.accepted;
    const recruit = feed.n_members < feed.accom;
    const buttonDisabled = !recruit || !feed.ongoing;
    const isLeader = myEnrollment?.is_leader;
    const pendingCount = feed.enrollments.reduce((prev, curr) => prev + (!curr.accepted ? 1 : 0), 0);

    const ga = useGA4React();

    const onApply = (message) => () => {
        setLoadingEnroll(true);
        axiosPost(null, urls({id: feed.id}).modoomEnroll, {message: message}).then(data => {
            setLoadingEnroll(false);
            if (data?.success) {
                toast(<Fragment>
                    <strong>가입 신청이 완료되었습니다!</strong><br/>
                    가입이 승인되면 채팅방에서 모둠원들과 대화를 나눌 수 있어요. 승인되면 메일로 알려드릴게요!
                </Fragment>);
                ga.gtag('event', 'enroll', {
                    'event_category': 'modoom',
                    'event_label': feed.title
                });
                refreshFeed && refreshFeed();
            } else {
                toast.error(data?.message || '알 수 없는 오류가 발생했습니다.')
            }
        });
    };

    const onCancelApply = () => {
        setLoadingEnroll(true);
        axiosDelete(null, urls({id: feed.id}).modoomEnroll).then(data => {
            setLoadingEnroll(false);
            if (data?.success) {
                toast('가입 신청 취소가 완료되었습니다.')
            }
            refreshFeed && refreshFeed();
        });
    };

    const onLike = () => {
        setIsLiked(!isLiked);
        axiosPost(null, urls({feedId: feed.id}).likeFeed).then(data => {
            if (data?.success) {
                ga.gtag('event', 'like', {
                    'event_category': 'modoom',
                    'event_label': feed.title,
                });
                setIsLiked(data.data.liked);
                setLikes(data.data.n_likes);
            }
        });
    };

    const withModal = (title, onClick, content) => () => {
        setModalState({...defaultModalState, title, onConfirm: onClick, isOpen: true, content: content})
    };


    const applyWithModal = () => {
        setModalState({
            ...defaultModalState,
            title: '모둠장에게 회원님을 소개해주세요.',
            onConfirm: onApply(enrollMsg),
            confirmText: '신청',
            isOpen: true,
            content: <EnrollMessageInput setMessage={setEnrollMsg}/>
        })
    };

    useEffect(() => {
        setModalState({...modalState, onConfirm: onApply(enrollMsg)})
    }, [enrollMsg])

    const callback = data => {
        if (data?.success) {
            history.push(appUrls().home);
        }
        toast(data?.message);
    };

    const onDelete = () => {
        axiosDelete(null, urls({modoomId: feed.id}).modoom).then(callback);
    };

    const onTerminate = () => {
        axiosPatch(null, urls({modoomId: feed.id}).modoom, {ongoing: false}).then(callback)
    };

    const onLeave = () => {
        axiosDelete(null, urls({id: feed.id}).modoomEnroll).then(callback);
    };

    const LikeCommentNumber = (
        <Col className='my-auto col-auto'>
            <div className='d-flex justify-content-end'>
                <div className='mr-2'>
                    <Fragment>
                        <FontAwesomeIcon icon={faEye} fixedWidth transform='shrink-5'
                                         className='text-info align-middle'/>
                        <span className='fs--1 align-middle'>{feed.n_views}</span>
                    </Fragment>
                </div>
                <div className='mr-2'>
                    <Fragment>
                        <FontAwesomeIcon icon={faHeart} fixedWidth transform='shrink-5'
                                         className='text-danger align-middle'/>
                        <span className='fs--1 align-middle'>{likes === undefined ? feed.n_likes : likes}</span>
                    </Fragment>
                </div>
            </div>
        </Col>
    );
    return (
        <PostCardWrapper itemOnly={itemOnly}>
            {hideProfile || showDetail && <Fragment>
                <div className={classNames('pt-2 pb-2', {
                    'px-3': !showDetail
                })}>
                    <Row noGutters className='justify-content-between'>
                        <Col className='col-auto'>
                            <ProfileAvatar profile={uploaderProfile} useLink
                                           className='align-middle'/>
                        </Col>
                        <Col className='my-auto pl-2'>
                            <Link className='text-900 font-weight-semi-bold text-decoration-none'
                                  to={appUrls({nickname: uploaderProfile?.nickname}).profile}>
                                {uploaderProfile?.full_name}
                            </Link>
                        </Col>
                        <Col className='col-auto d-flex align-items-center'>
                            <div className='fs--2 text-600'>
                                <Moment locale='ko' fromNow className='fs--2'>{feed.created_at}</Moment>
                            </div>
                            {isLeader &&
                            <Link className='fs--2 ml-2 font-weight-semi-bold text-600 text-decoration-none'
                                  to={appUrls({modoomId: feed.id}).modoomEdit}>
                                수정
                            </Link>}
                        </Col>
                    </Row>
                </div>
                <hr className='my-0 border-200'/>
            </Fragment>}
            <div className={classNames('', {
                'cursor-pointer': useLink,
                'pt-1 px-3 pb-2': !showDetail && !itemOnly
            })} onClick={() => {
                if (useLink) {
                    history.push(appUrls({feedId: feed.id}).feedDetail);
                }
            }}>
                <Row noGutters className='mt-2 mb-1'>
                    <Col className=''>
                        <div className='font-weight-semi-bold text-900 my-auto user-select-none'>
                            <div>
                                {!recruit && <Badge color='soft-info' className='px-1 mr-1 align-middle'>모집완료</Badge>}
                                {!feed.ongoing &&
                                <Badge color='soft-danger' className='px-1 mr-1 align-middle'>종료됨</Badge>}
                                {!showDetail && recruit && pendingCount !== 0 &&
                                <span className='fs--1 align-middle text-800 font-weight-medium'>
                                        <strong className='text-danger font-weight-bold'>{pendingCount}</strong>명 신청 중
                                    </span>}
                            </div>
                            <span className='align-middle text-overflow-ellipsis-1'>{feed.title}</span>
                        </div>
                    </Col>
                    {showDetail || <Col className='col-auto pl-2'>
                        <Moment locale='ko' fromNow className='fs--2'>{feed.created_at}</Moment>
                    </Col>}
                </Row>
                <div className='d-flex'>
                    <div className='fs--1 d-flex align-items-center mr-2'>
                        <Users size={15} className='mr-1'/>
                        {feed.n_members}/{feed.accom}명
                    </div>
                    <div className='fs--1 d-flex align-items-center'>
                        {feed.location && <MapPin size={15} className='mr-1'/>}
                        {feed.location}
                    </div>
                </div>
                {/*<TruncatedText preserveNewline lines={truncateLines || (showDetail ? 0 : 2)}*/}
                {/*               className='fs--1 my-2 text-900'>*/}
                {/*    {feed.content}*/}
                {/*</TruncatedText>*/}
                {showDetail &&
                <div className={classNames('fs--1 my-2 text-900', {'text-overflow-ellipsis': truncateLines})}>
                    {feed.content.split('\n').map((line, i, arr) => {
                        const span_line = <span key={i}>{line}</span>;
                        if (i === arr.length - 1) {
                            return span_line;
                        } else {
                            return [span_line, <br key={i + 'br'}/>];
                        }
                    })}
                </div>}
                {showDetail && <Row className='' noGutters>
                    <Col className='pr-1'>
                        {feed.keywords.map(keyword => {
                            return <KeywordBadge key={keyword.id} keyword={keyword} useLink={showDetail}/>
                        })}
                    </Col>
                </Row>}
                <Row className='mt-2' noGutters>
                    <Col className='col my-auto'>
                        <ModoomProfileGroup modoom={feed} size='2.5rem' limit={6} useLink={showDetail}/>
                    </Col>
                    {LikeCommentNumber}
                </Row>
            </div>
            {showDetail && <Row noGutters className='mt-3'>
                <Col className='my-auto white-space-nowrap'>
                    {accepted
                        ? <InteractionButton
                            text='채팅방 입장하기'
                            fill icon='MessageCircle'
                            className='py-1'
                            disabled={!feed.ongoing}
                            to={appUrls({modoomId: feed.id}).chatsModoom}/>
                        : <InteractionButton
                            text={myEnrollment ? '신청 취소' : '가입 신청'}
                            fill icon={myEnrollment ? 'UserX' : 'ArrowRight'}
                            disabled={myEnrollment ? false : buttonDisabled}
                            isLoading={loadingEnroll}
                            onClick={myEnrollment ? withModal('가입 신청을 취소하시겠습니까?', onCancelApply) : applyWithModal}
                            className='py-1'/>}
                </Col>
                {accepted && <Col className='pl-2'>
                    {isLeader &&
                    <InteractionButton text={feed.deletable ? '모둠 삭제하기' : '모둠 종료하기'} disabled={!feed.ongoing}
                                       onClick={feed.deletable
                                           ? withModal('정말 삭제하시겠습니까?', onDelete)
                                           : withModal('정말 종료하시겠습니까?', onTerminate)}
                                       className='text-danger py-1 font-weight-medium'/>}
                    {isLeader || <InteractionButton text='모둠 나가기' disabled={!feed.ongoing}
                                                    className='text-danger py-1 font-weight-medium'
                                                    onClick={withModal('정말 나가시겠습니까?', onLeave)}
                    />}
                </Col>}
                {!accepted && <Col className='pl-2'>
                    <InteractionButton text='모둠장과 대화' disabled={!feed.ongoing}
                                       icon='MessageCircle'
                                       className='py-1 font-weight-medium'
                                       to={appUrls({nickname: uploaderProfile?.nickname}).chatsDirect}
                                       onClick={withModal('정말 나가시겠습니까?', onLeave)}
                    />
                </Col>}
                {likes !== undefined && <Col className='col-auto pl-2'>
                    <InteractionButton faIcon={isLiked ? faHeart : farHeart}
                                       text='좋아요'
                                       className='py-1'
                                       faClassName={classNames('mx-1', {'text-danger': isLiked})}
                                       onClick={onLike}
                    />
                </Col>}
            </Row>}
        </PostCardWrapper>
    );
};

export default React.memo(FeedCard);