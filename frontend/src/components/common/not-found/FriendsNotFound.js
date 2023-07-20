import React from 'react';
import NotFoundWrapper from "./NotFoundWrapper";

const FriendsNotFound = ({className}) => {
    return (
        <NotFoundWrapper className={className} title='친구가 없습니다.'>
            상대방의 프로필 페이지에서 친구를 신청할 수 있습니다.
        </NotFoundWrapper>
    );
};

export default FriendsNotFound;