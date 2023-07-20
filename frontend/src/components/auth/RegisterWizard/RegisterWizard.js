import React, {Fragment, useContext, useState} from 'react';
import Logo from "../../common/Logo";
import Section from "../../common/Section";
import RegisterWizardProvider from "./RegisterWizardProvider";
import BasicForm from "./BasicForm";
import {AuthContext, RegisterWizardContext} from "../../../context/Context";
import {useForm} from "react-hook-form";
import urls, {appUrls} from "../../../urls";
import InteractionButton from "../../common/InteractionButton";
import {Link} from "react-router-dom";
import AskRealNameForm from "./AskRealNameForm";
import AskNicknameForm from "./AskNicknameForm";
import {Col, Form, Row} from "reactstrap";
import AskVerifyEmailForm from "./AskVerifyEmailForm";
import {axiosPost} from "../../../actions/axios";
import {REGISTER_SUCCESS, USER_LOADED} from "../../../actions/types";
import {useHistory} from 'react-router-dom';
import {toast} from "react-toastify";
import RegisterComplete from "./RegisterComplete";

export const PromptText = ({children, title, description}) => {
    // d-flex flex-center 삭제
    return (
        <div style={{minHeight: '3rem'}}
             className='mt-3 mb-4 fs-1 font-weight-medium text-900 word-break-keep-all text-center user-select-none'>
            {title || children}
            <div className='mt-3 fs--1 text-800'>
                {description}
            </div>
        </div>
    )
};

const RegisterWizard = () => {
    const {user, step, setStep, errorMsg, setErrorMsg} = useContext(RegisterWizardContext);
    const [loading, setLoading] = useState(false);
    const {authState, authDispatch} = useContext(AuthContext);
    const {register, handleSubmit, errors, watch} = useForm({
        mode: 'onBlur',
        reValidateMode: 'onChange'
    });

    const onSubmit = () => {
        if (step === 3) {
            handleFinalSubmit();
        } else {
            if (step === 1) {
                if (user.password !== user.password_confirm) {
                    setErrorMsg('비밀번호가 일치하지 않습니다. 비밀번호를 다시 한번 확인해주세요.');
                    return
                } else if ((/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/).test(user.password)) {
                    setErrorMsg('앗, 비밀번호에 한글이 포함되어 있어요! 영문으로 입력해주세요.')
                    return
                } else {
                    setErrorMsg('');
                }
            }

            setLoading(true);
            axiosPost(null, urls().validate, {...user, step: step, email: user.email + "@snu.ac.kr"}).then(data => {
                setLoading(false);
                if (data?.success) {
                    setErrorMsg('');
                    setStep(step + 1);
                } else {
                    setErrorMsg(data?.message || '알 수 없는 오류가 발생했습니다. 새로고침 후 다시 시도해주세요.');
                }
            });
        }
    };

    const handleFinalSubmit = () => {
        setLoading(true);
        axiosPost(null, urls().register, {...user, email: user.email + "@snu.ac.kr"}).then(data => {
            setLoading(false);
            if (data?.success === false) {
                setErrorMsg(data?.message);
            } else {
                authDispatch({
                    type: REGISTER_SUCCESS,
                    payload: {...data}
                });
                setStep(4);
            }
        });
    };

    return (
        <Fragment>
            {step !== 4 && <Section>
                <Form>
                    <div className='d-flex flex-center mt-2'>
                        <div className='w-100 w-md-50'>
                            <div style={{minHeight: '13rem'}}>
                                {step === 0 && <AskVerifyEmailForm register={register} errors={errors}/>}
                                {step === 1 && <BasicForm register={register} errors={errors}/>}
                                {step === 2 && <AskRealNameForm register={register} errors={errors}/>}
                                {step === 3 && <AskNicknameForm register={register} errors={errors} watch={watch}/>}
                            </div>
                            {errorMsg && <div className='mt-3 fs--1 text-danger text-center'>
                                {errorMsg}
                            </div>}
                            {step !== 0 &&
                            <Row noGutters className='flex-center mt-4 px-4'>
                                <Col>
                                    <InteractionButton icon={step === 3 ? 'Check' : 'ArrowRight'} isLoading={loading}
                                                       text={step === 3 ? '완료' : '다음'} highlight className='py-2'
                                                       onClick={handleSubmit(onSubmit)}/>
                                </Col>
                            </Row>}
                            {step === 1 && <div className='fs--2 text-center mt-4'>
                                <span>다음 버튼을 클릭하면 <br/> 모둠의 <a target='_blank' href={appUrls().terms}>이용약관</a> 및 <a
                                    target='_blank' href={appUrls().privacy}>개인정보 처리방침</a>에 동의하게 됩니다.</span>
                            </div>}
                            {step === 2 && <div className='fs--2 text-center mt-4'>
                                <span><strong>잠깐!</strong> 한 번 잘못 설정한 이름은 바꿀 수 없어요 😨 <br/> 다시 한번 확인해주세요 </span>
                            </div>}

                            {step === 3 && <div className='fs--2 text-center mt-4'>
                                <span> 별명은 언제든지 프로필 페이지에서 수정할 수 있어요 😀 </span>
                            </div>}
                        </div>
                    </div>
                </Form>
            </Section>}
            {step === 4 && <RegisterComplete/>}
        </Fragment>

    );
};

export default RegisterWizard;