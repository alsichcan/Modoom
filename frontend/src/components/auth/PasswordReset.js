import React, {useContext, useState} from 'react';
import {Row, Col, Input, Collapse} from 'reactstrap';
import Section from "../common/Section";
import {useForm} from "react-hook-form";
import CardSection from "../common/CardSection";
import WizardInput from "../common/wizard-input/WizardInput";
import InteractionButton from "../common/InteractionButton";
import classNames from "classnames";
import {PromptText} from "./RegisterWizard/RegisterWizard";
import {axiosPost} from "../../actions/axios";
import urls, {appUrls} from "../../urls";
import {toast} from "react-toastify";
import {useHistory} from 'react-router-dom';
import AppContext from "../../context/Context";
import {defaultModalState} from "../../Main";

const PasswordReset = () => {
    const history = useHistory();
    const [formData, setData] = useState({username: '', code: '', password: ''});
    const [step, setStep] = useState(0);
    const {setModalState} = useContext(AppContext);
    const [loading, setLoading] = useState({0: false, 1: false, 2: false})
    const handleInputChange = ({value, name}) => {
        setData({...formData, [name]: value})
    };

    const sendWithModal = () => {
        if (formData.username.includes('@')) {
            setModalState({
                ...defaultModalState,
                isOpen: true,
                title: '이메일 주소를 입력하신 것 같습니다.',
                content: '이메일 주소가 아닌 아이디를 입력해주세요. 이대로 진행하시려면 확인을 눌러주세요.',
                onConfirm: onSendCode
            });
        } else {
            onSendCode();
        }
    };

    const onSendCode = () => {
        setLoading({...loading, 0: true})
        axiosPost(null, urls().verifyEmailReset, formData).then(data => {
            setLoading({...loading, 0: false})
            if (!!!data) {
                return
            }
            if (data.success) {
                setStep(1);
                toast.success(data.data + '로 인증 메일이 전송되었습니다. 이메일이 오지 않으면 스팸메일함을 확인해주세요!');
            } else {
                toast.error(data.message || '가입 정보를 찾을 수 없습니다. 이메일을 다시 한 번 확인해주세요.');
            }
        });
    };

    const onVerify = () => {
        setLoading({...loading, 1: true})
        axiosPost(null, urls().verifyCodeReset, formData).then(data => {
            setLoading({...loading, 1: false})
            if (!!!data) {
                return
            }
            if (data.success) {
                setStep(2);
            } else {
                toast.error(data.message || '알 수 없는 오류가 발생했습니다.')
            }
        });
    };

    const onChangePassword = () => {
        setLoading({...loading, 2: true})
        axiosPost(null, urls().resetPassword, formData).then(data => {
            setLoading({...loading, 2: false})
            if (!!!data) {
                return
            }
            if (data.success) {
                history.push(appUrls().login);
                toast.success(data.message);
            } else {
                toast.error(data.message || '알 수 없는 오류가 발생했습니다.')
            }
        });
    };

    return (
        <div className='container mt-10'>
            <PromptText description='비밀번호 초기화 코드를 보내드리겠습니다.'>
                가입 시 입력하신 <strong className='font-weight-bold'>SNU 메일</strong>을 입력해주세요.
            </PromptText>
            <CardSection hasPadding={false} hasMargin={false}>
                <Row noGutters>
                    <Col>
                        <div className='px-2 py-1'>
                            <WizardInput type='text'
                                         name='email'
                                         placeholder={'example@snu.ac.kr'}
                                         onChange={({target}) => handleInputChange(target)}
                            />
                        </div>
                    </Col>
                    <Col className='col-auto d-flex p-1'>
                        <InteractionButton text='인증번호 전송' onClick={sendWithModal} disabled={step !== 0}
                                           isLoading={loading['0']}/>
                    </Col>
                </Row>
            </CardSection>
            <Collapse isOpen={step >= 1}>
                <CardSection className='mt-3' hasPadding={false} hasMargin={false}>
                    <Row noGutters>
                        <Col>
                            <div className='px-2 py-1'>
                                <WizardInput
                                    type='text'
                                    name='code'
                                    placeholder='인증번호'
                                    autoComplete='off'
                                    onChange={({target}) => handleInputChange(target)}
                                />
                            </div>
                        </Col>
                        <Col className='col-auto d-flex p-1'>
                            <InteractionButton text='인증하기' className='px-2 py-1' iconSize={20} icon='Check'
                                               onClick={onVerify} disabled={step !== 1} isLoading={loading['1']}/>
                        </Col>
                    </Row>
                </CardSection>
            </Collapse>
            <Collapse isOpen={step >= 2}>
                <CardSection className='mt-3' hasPadding={false} hasMargin={false}>
                    <Row noGutters>
                        <Col>
                            <div className='px-2 py-1'>
                                <WizardInput
                                    type='password'
                                    name='password'
                                    placeholder='새로운 비밀번호를 입력해주세요.'
                                    autoComplete='off'
                                    onChange={({target}) => handleInputChange(target)}
                                />
                            </div>
                        </Col>
                        <Col className='col-auto d-flex p-1'>
                            <InteractionButton text='확인' className='px-2 py-1' iconSize={20} icon='Check'
                                               onClick={onChangePassword}
                                               disabled={step !== 2} isLoading={loading['2']}/>
                        </Col>
                    </Row>
                </CardSection>
            </Collapse>
        </div>
    );
};

export default PasswordReset;