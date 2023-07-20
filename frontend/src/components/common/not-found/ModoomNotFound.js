import React from 'react';
import {PlusCircle} from "react-feather";
import NotFoundWrapper from "./NotFoundWrapper";

const ModoomNotFound = ({className}) => {
    return (
        <NotFoundWrapper className={className} title='아직 참여중인 모둠이 없습니다.'>
            아래 <PlusCircle size={13}/> 버튼을 눌러 모둠을 만들거나,<br/>이미 만들어진 모둠에 자유롭게 참여해보세요!
        </NotFoundWrapper>
    );
};

export default ModoomNotFound;