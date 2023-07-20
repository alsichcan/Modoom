import React from 'react';
import {Send} from "react-feather";
import NotFoundWrapper from "./NotFoundWrapper";

const DMNotFound = ({className}) => {
    return (
        <NotFoundWrapper className={className} title='새로운 대화를 시작해보세요.'>
            상대방 프로필 페이지의 <Send size={13}/> 메시지 보내기 버튼을 통해<br/>직접 대화를 시작할 수 있습니다.
        </NotFoundWrapper>
    );
};

export default DMNotFound;