import React, {Fragment} from 'react';
import {Badge, Col, Row} from 'reactstrap';
import {MapPin, Users} from "react-feather";
import TruncatedText from "./TruncatedText";
import ModoomProfileGroup from "./ModoomProfileGroup";
import KeywordBadge from "../common/KeywordBadge";


export const UnreadBadge = ({unreadCount, className}) => {
    if (!(unreadCount > 0)) {
        return null;
    }
    return <span className={'bg-danger border-radius-1 text-white font-weight-bold px-2 ' + className}>
            {unreadCount}
        </span>
};

export const UnreadMessage = ({unreadCount}) => {
    if (!(unreadCount > 0)) {
        return null;
    }
    return <div className='fs--2'>
        <span className='bg-danger border-radius-1 text-white font-weight-bold px-2 align-middle'>
            {unreadCount}
        </span>
        <span className='ml-1 align-middle'>
            개의 읽지 않은 메시지가 있습니다.
        </span>
    </div>
};

const ModoomVerticalListItem = ({modoom, showContent, isLast, unreadCount}) => {
    return (
        <div className=''>
            <Fragment>
                <Row noGutters className='mt-2 mb-1 pl-1'>
                    <Col className='my-auto d-flex align-items-center justify-content-between'>
                        <div className='font-weight-semi-bold text-900 my-auto user-select-none'>
                            {modoom.title}
                        </div>
                        <UnreadMessage unreadCount={unreadCount}/>
                    </Col>
                </Row>
                <div className='d-flex pl-1'>
                    <div className='fs--1 d-flex align-items-center mr-2'>
                        <Users size={15} className='mr-1'/>
                        {modoom.n_members}/{modoom.accom}명
                    </div>
                    <div className='fs--1 d-flex align-items-center'>
                        {modoom.location && <MapPin size={15} className='mr-1'/>}
                        {modoom.location}
                    </div>
                </div>
            </Fragment>
            {showContent && <TruncatedText preserveNewline lines={3} className='pl-1 fs--1 my-2 text-900'>
                {modoom.content}
            </TruncatedText>}
            <div className=''>
                {modoom.keywords.map(keyword => {
                    return <KeywordBadge key={keyword.id} keyword={keyword}/>
                })}
            </div>
            <Row className='mt-2' noGutters>
                <Col className='col-auto'>
                    <ModoomProfileGroup modoom={modoom} size='2.5rem' limit={10}/>
                </Col>
            </Row>
            {isLast || <hr className='border-300 my-3'/>}
        </div>
    );
};

export default ModoomVerticalListItem;