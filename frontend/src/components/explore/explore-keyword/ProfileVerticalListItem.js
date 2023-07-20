import React, {Fragment} from 'react';
import {Col, Row} from 'reactstrap';
import TruncatedText from "../../feeds/TruncatedText";
import ProfileAvatar from "../../common/ProfileAvatar";
import {appUrls} from "../../../urls";
import {useHistory} from "react-router-dom";
import {Send} from "react-feather";
import {UnreadMessage} from "../../feeds/ModoomVerticalListItem";

const ProfileVerticalListItem = ({isLast, profile, to, unreadCount}) => {
    const history = useHistory();
    return (
        <Fragment>
            <Row noGutters>
                <Col className='col-auto pr-2'>
                    <ProfileAvatar profile={profile} className='align-middle' size='2xl' useLink/>
                </Col>
                <Col className='text-900 cursor-pointer' onClick={() => {
                    history.push(to || appUrls({nickname: profile.nickname}).profile)
                }}>
                    <div className='fs--1 text-900 font-weight-semi-bold'>
                        {profile.full_name}
                    </div>
                    <div className='fs--2'>
                        {!!!unreadCount && (profile.bio
                            ? <TruncatedText useReadMore={false} lines={2}>
                                {profile.bio}
                            </TruncatedText>
                            : '@' + profile.nickname)}
                        <UnreadMessage unreadCount={unreadCount}/>
                    </div>
                </Col>
                <Col className='col-auto my-auto pl-1 cursor-pointer' onClick={() => {
                    history.push(appUrls({nickname: profile.nickname}).chatsDirect)
                }}>
                    {/*<InteractionButton icon='UserPlus' text='친구 신청' highlight/>*/}
                    <Send className='text-primary'/>
                </Col>
            </Row>
            {isLast || <hr className='border-300 my-3'/>}
        </Fragment>
    );
};

export default ProfileVerticalListItem;