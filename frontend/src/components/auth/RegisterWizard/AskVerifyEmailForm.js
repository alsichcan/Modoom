import React, {Fragment, useContext, useState} from 'react';
import {Row, Col, Form, Collapse, Input} from 'reactstrap';
import {PromptText} from "./RegisterWizard";
import CardSection from "../../common/CardSection";
import WizardInputInner from "../../common/wizard-input/WizardInputInner";
import InteractionButton from "../../common/InteractionButton";
import {axiosPost} from "../../../actions/axios";
import urls from "../../../urls";
import classNames from "classnames";
import {RegisterWizardContext} from "../../../context/Context";
import {useGA4React} from "ga-4-react";

const AskVerifyEmailForm = () => {
    const {handleInputChange, user, setStep, errorMsg, setErrorMsg} = useContext(RegisterWizardContext);
    const [sendLoading, setSendLoading] = useState(false);
    const [codeLoading, setCodeLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const ga = useGA4React();

    const handleSend = () => {
        if (user.email === '') {
            setErrorMsg('SNU 이메일을 입력해주세요.')
            return
        }

        setSendLoading(true);
        axiosPost(null, urls().verifyEmail, {email: user.email + '@snu.ac.kr'}).then(data => {
            setSendLoading(false);
            if (data?.success) {
                ga.gtag('event', 'send_verification', {
                    'event_category': 'signup',
                });
                setErrorMsg('');
                setEmailSent(true);
            } else {
                setErrorMsg(data?.message || '알 수 없는 오류가 발생했습니다. 다시 한번만 시도해주세요!');
            }
        });
    };

    const handleCode = () => {
        setCodeLoading(true);
        axiosPost(null, urls().verifyCode, {email: user.email + '@snu.ac.kr', code: user.code}).then(data => {
            setCodeLoading(false);
            if (data?.success) {
                ga.gtag('event', 'verify', {
                    'event_category': 'signup',
                });
                setErrorMsg('');
                setStep(1);
            } else {
                setErrorMsg(data?.message || '알 수 없는 오류가 발생했습니다. 다시 한번만 시도해주세요!');
            }
        });
    };

    return (
        <Fragment>
            <PromptText description={
                <span>서울대학교 학생만 이용할 수 있어요</span>
            }>
                <span className='fs-2 mr-2'>👋</span>
                <span className=''>환영합니다!</span>
            </PromptText>
            <CardSection className='' hasPadding={false}>
                <div className='px-2 py-1'>
                    <Row noGutters>
                        <Col className=''>
                            <Input
                                type='email'
                                name='email'
                                placeholder='example'
                                autoComplete='off'
                                value={user.email}
                                onChange={({target}) => {
                                    handleInputChange(target);
                                }}
                                onKeyPress={e => {
                                    e.key === 'Enter' && handleSend();
                                }}
                                className={classNames('modoom-form-control')}
                            />
                        </Col>
                        <Col className='my-auto'>
                            @snu.ac.kr
                        </Col>
                        <Col className='col-auto my-auto'>
                            <InteractionButton text={emailSent ? '전송됨' : '인증번호 전송'} className='px-2 py-1' iconSize={20}
                                               onClick={handleSend} isLoading={sendLoading}
                                               disabled={emailSent}/>
                        </Col>
                    </Row>
                </div>
            </CardSection>
            <Collapse isOpen={emailSent}>
                <CardSection className='' hasPadding={false} hasMargin={false}>
                    <div className='px-3 py-1'>
                        <Row>
                            <Col>
                                <Input
                                    type='text'
                                    name='code'
                                    placeholder='인증번호'
                                    autoComplete='off'
                                    value={user.code}
                                    onChange={({target}) => {
                                        handleInputChange(target);
                                    }}
                                    onKeyPress={e => {
                                        e.key === 'Enter' && handleCode();
                                    }}
                                    className={classNames('modoom-form-control')}
                                />
                            </Col>
                            <Col className='col-4 my-auto pl-0 pr-2'>
                                <InteractionButton text='인증하기' className='px-2 py-1' iconSize={20} icon='Check'
                                                   onClick={handleCode} disabled={user.code?.length !== 6}
                                                   isLoading={codeLoading}/>
                            </Col>
                        </Row>
                    </div>
                </CardSection>
            </Collapse>
            {emailSent || <PromptText description={
                <span> 이 메일 주소로 중요한 알림🔔을 보내드릴게요.<br/>
                <strong>프로필 편집</strong> 페이지에서 메일 주소를 변경하거나<br/>
                알림 설정을 할 수 있어요.
                </span>
            }>
            </PromptText>}
            {emailSent && <div>
                <PromptText description={
                    '혹시 메일이 오지 않는다면 스팸메일함을 확인해주세요!'
                }>
                </PromptText>
            </div>}

        </Fragment>
    );
};

export default AskVerifyEmailForm;