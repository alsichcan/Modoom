import React from 'react';
import {Row, Col} from 'reactstrap';
import Avatar from "../../common/Avatar";
import classNames from 'classnames';
import ProfileAvatar from "../../common/ProfileAvatar";
import Moment from "react-moment";

const Message = ({message, isLast, ref}) => {
    const profile = message.profile;
    return (
        <div className='container' ref={ref}>
            <Row noGutters>
                <Col className='col-auto pr-2'>
                    {profile && <ProfileAvatar size='2xl' profile={profile} useLink={!!profile?.full_name}/>}
                </Col>
                <Col>
                    <div className='fs--1'>
                        <span className='text-800'>
                            {profile?.full_name || '(알 수 없음)'}
                        </span>
                        <Moment locale='ko' format='LT' className='ml-2 fs--2 text-500'>{message.created_at}</Moment>
                    </div>
                    <div className='text-900'>
                        {message.content.split('\n').map((line, index) => {
                            return (<span key={index}>{line}<br/></span>)
                        })}
                    </div>
                </Col>
            </Row>
            <hr className={classNames('my-2', {
                'border-200': !isLast,
                'visibility-hidden': isLast
            })}/>
        </div>
    );
};

export default Message;