import React from 'react';
import {Link} from 'react-router-dom';
import {Card, CardBody} from 'reactstrap';
import NotFoundEmojiWrapper from "../common/not-found/NotFoundEmojiWrapper";

const Error404 = () => (
    <Card className="text-center border-radius-1">
        <CardBody className="p-5">
            <NotFoundEmojiWrapper/>
            <p className="lead mt-4 text-800 text-sans-serif font-weight-semi-bold word-break-keep-all">
                요청한 페이지를 찾을 수 없습니다.
            </p>
            <hr/>
            <p className='word-break-keep-all'>
                페이지의 주소가 잘못 입력되었거나, 페이지 주소가 변경 또는 삭제되었습니다.
            </p>
            <Link className="btn btn-primary btn-sm mt-3 border-radius-1" to="/">
                홈으로 가기
            </Link>
        </CardBody>
    </Card>
);

export default Error404;
