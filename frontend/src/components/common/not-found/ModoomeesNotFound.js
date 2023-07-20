import React from 'react';
import NotFoundWrapper from "./NotFoundWrapper";

const ModoomeesNotFound = ({className}) => {
    return (
        <NotFoundWrapper className={className} title='함께한 모둠원이 없습니다.'>
            모둠을 개설하거나 이미 개설된 모둠에 자유롭게 참여해보세요!
        </NotFoundWrapper>
    );
};

export default ModoomeesNotFound;