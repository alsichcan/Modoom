import React from 'react';
import Avatar from "../common/Avatar";
import classNames from "classnames";
import InteractionButton from "../common/InteractionButton";

const ProfileCard = ({image_url, name, status, isFirst, isLast}) => {
    return (
        <div className={classNames('bg-white border-radius-1 p-2 border mx-sm-0 z-index-10', {
            'ml-2': isFirst,
            'mr-2': isLast
        })}>
            <div className='d-flex justify-content-center'>
                <Avatar src={image_url} size='3xl'/>
            </div>
            <div className='text-center mt-1 fs--1 text-900 font-weight-medium'>
                {name}
            </div>
            <div className='mt fs--2 p-1 text-800 text-overflow-ellipsis' style={{height: '2.5rem'}}>
                {status}
            </div>
            {/*<TruncatedText lines={2} useReadMore={false} className='mt-1 fs--2 p-1 text-800'>*/}
            {/*    */}
            {/*</TruncatedText>*/}
            <InteractionButton text={'일촌 신청'} icon={'UserPlus'} fill highlight className='mt-2'/>
        </div>
    );
};

export default ProfileCard;