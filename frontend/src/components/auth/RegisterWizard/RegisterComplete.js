import React, {Fragment} from 'react';
import {Row, Col, CardBody, Card} from 'reactstrap';
import NotFoundEmojiWrapper from "../../common/not-found/NotFoundEmojiWrapper";
import {Link} from "react-router-dom";
import animationData from "../../../assets/lottie/celebration.json";
import Lottie from "react-lottie";

const RegisterComplete = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMin slice'
        }
    };
    return (
        <div className='vh-100 d-flex flex-center'>
            <Card className="text-center border-radius-1 mx-3">
                <CardBody className="px-4 pt-4 pb-0">
                    <Row className='justify-content-center'>
                        <Col className='col-12'>
                            <div className="" style={{marginTop: '-27.5rem'}}>
                                <Lottie options={defaultOptions}/>
                            </div>
                        </Col>
                    </Row>
                    <p className="lead mt-4 text-800 text-sans-serif font-weight-semi-bold word-break-keep-all">
                        가입이 완료되었어요 🎉
                    </p>
                    <hr className='border-300'/>
                </CardBody>
                <CardBody className='pt-0 px-2'>
                    <p className='word-break-keep-all'>
                        마음에 드는 모둠에 참여하거나
                        <br/>
                        <br/>
                        직접 모둠을 만들어
                        <br/>
                        마음 맞는 사람들을 모아보세요!
                    </p>
                    <Link className="btn btn-primary btn-sm mt-3 border-radius-1" to="/">
                        입장하기
                    </Link>
                </CardBody>
            </Card>
        </div>
    );
};

export default RegisterComplete;