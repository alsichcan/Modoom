import React from 'react';
import {Card, CardBody, Col, Row} from 'reactstrap';
import Logo from "../navbar/Logo";
import Section from "../common/Section";


const Maintenance = () => (
    <Section className="py-0">
        <Row className="flex-center min-vh-100 py-6">
            <Col sm={11} md={9} lg={7} xl={6} className="col-xxl-5">
                <Logo/>
                <Card className="text-center">
                    <CardBody className="p-5">
                        <div className="display-1 text-200 fs-error">준비중</div>
                        <p className="lead mt-4 text-800 text-sans-serif font-weight-semi-bold">현재 준비중인 페이지입니다.</p>
                        <hr/>
                        <p>
                            조금만 기다려주세요!
                            <a href="mailto:contact@y-tone.co.kr" className="ml-1">
                                문의하기
                            </a>
                        </p>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    </Section>
);

export default Maintenance;
