import React, {Fragment, useContext, useEffect, useState} from 'react';
import {Col, CustomInput, Form, Row} from 'reactstrap';
import Section from "../common/Section";
import Logo from "../common/Logo";
import CardSection from "../common/CardSection";
import {useForm} from "react-hook-form";
import InteractionButton from "../common/InteractionButton";
import urls, {appUrls} from "../../urls";
import {Link} from "react-router-dom";
import {login} from "../../actions/auth";
import {AuthContext} from "../../context/Context";
import withRedirect from "../hoc/withRedirect";
import WizardInput from "../common/wizard-input/WizardInput";
import Typed from "react-typed";
import ScreenshotSection from "../pre-landing/ScreenshotSection";
import img1 from '../../assets/img/landing/home.png'
import img2 from '../../assets/img/landing/keywords.png'
import img3 from '../../assets/img/landing/chat.png'
import img4 from '../../assets/img/landing/profile.png'
import CountUp from "react-countup";
import {axiosGet} from "../../actions/axios";


const Login = ({setRedirectUrl, setRedirect}) => {
    const {register, handleSubmit, errors} = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange'
    });
    const [remember, setRemember] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const {authState, authDispatch} = useContext(AuthContext);
    const [count, setCount] = useState(null);

    useEffect(() => {
        axiosGet(null, urls().count).then(data => {
            if (data.data) {
                setCount(data.data);
            }
        });
    }, []);

    const onSubmit = data => {
        setLoading(true);
        login({...data, remember})(null, authDispatch).then(() => {
            setLoading(false);
        }, (errorResponse) => {
            setLoading(false);
            const status = errorResponse?.status;
            switch (true) {
                case status === 400:
                    setErrorMessage('아이디 또는 비밀번호가 일치하지 않습니다.');
                    break;
                case status >= 500:
                    setErrorMessage('서버 오류가 발생했습니다. 고객센터로 문의해주시기 바랍니다.');
                    break;
                default:
                    setErrorMessage('인터넷이 연결되어 있는지 확인해주시기 바랍니다.');
                    break;
            }
        });
    };

    useEffect(() => {
        if (authState.isAuthenticated && authState.token) {
            setRedirectUrl(appUrls().home);
            setRedirect(true);
        }
    }, [authState]);

    return (
        <Fragment>
            <Section>
                <Form>
                    <div className='d-flex flex-center'>
                        <div className='w-100 w-md-50'>
                            <div className='d-flex flex-center mb-1 fs--1 text-900'>
                                소모임👨‍👦‍👦 ㆍ 스터디📝 ㆍ 프로젝트📊
                            </div>

                            <div className='d-flex flex-center'>
                                <div className='fs-0 mb-4 font-weight-normal text-900 text-left'>
                                    <Typed
                                        strings={['마음 맞는', '믿을 만한', '새로운']}
                                        typeSpeed={120}
                                        backDelay={1500}
                                        backSpeed={70}
                                        className="font-weight-bold pl-2"
                                        loop
                                    />
                                    사람들과 함께하는 곳
                                </div>
                            </div>

                            <Logo width={200} className='mb-4'/>

                            <CardSection hasPadding={false}>
                                <div className='px-3 pt-2'>
                                    <WizardInput type='text'
                                                 name='username'
                                                 placeholder={'모둠 아이디'}
                                                 autoComplete
                                                 innerRef={register({
                                                     required: '아이디를 입력해주세요.',
                                                 })}
                                                 errors={errors}
                                    />
                                </div>
                                <hr className='my-2 border-300'/>
                                <div className='px-3 pb-2'>
                                    <Row>
                                        <Col>
                                            <WizardInput
                                                type='password'
                                                name='password'
                                                autoComplete
                                                placeholder={'모둠 비밀번호'}
                                                innerRef={register({
                                                    required: '비밀번호를 입력해주세요.',
                                                })}
                                                onKeyPress={e => {
                                                    e.key === 'Enter' && handleSubmit(onSubmit)();
                                                }}
                                                errors={errors}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            </CardSection>
                            <InteractionButton className='mx-2 py-1' iconSize={20} fill
                                               text='로그인' loadingText='로그인 중'
                                               isLoading={loading}
                                               onClick={handleSubmit(onSubmit)}/>
                            {errorMessage && <div className='text-center fs--1 text-danger mb-3'>
                                {errorMessage}
                            </div>}
                            <div className='d-flex mt-3 justify-content-between align-items-center mx-2'>
                                <CustomInput
                                    type="checkbox"
                                    id="remember"
                                    checked={remember}
                                    onChange={({target}) => setRemember(target.checked)}
                                    label="로그인 상태 유지"
                                    className='user-select-none'
                                />

                                <div className='fs--1'>
                                    <Link className='' to={appUrls().forgotUsername}>아이디</Link>
                                    <span className='mx-1'>또는</span>
                                    <Link className='' to={appUrls().passwordReset}>비밀번호 찾기</Link>
                                </div>
                            </div>
                            <hr className='border-300'/>
                            <div className='text-center'>
                                <div className='fs--2 fs-sm--1 mt-4 mb-2 nowrap text-800 font-weight-medium'>
                                    현재 <CountUp end={count?.users || 0} duration={3}
                                                className='text-primary font-weight-semi-bold'/>명의
                                    서울대생이 <CountUp end={count?.modooms || 0} duration={3}
                                                   className='text-primary font-weight-semi-bold'/>개의 모둠에서
                                    활동하고
                                    있어요!
                                </div>
                                <span className='text-800 text-medium'>모둠에 처음 오셨나요?</span>
                                <Link to={appUrls().register} className='text-decoration-none text-center ml-2 mb-2'>
                                    회원가입
                                </Link>
                            </div>
                        </div>
                    </div>
                </Form>
            </Section>
            <div className='mb-6'>
                <ScreenshotSection src={img1} title='나를 표현하기' lead='여러 모둠을 둘러보고 관심있는 모둠에 가입해요'/>
                <ScreenshotSection src={img2} title='자유롭게 소통하기' lead='원하는 주제의 모둠만 모아서 볼 수 있어요'/>
                <ScreenshotSection src={img3} title='모둠 구성하기' lead='모둠에서 마음맞는 사람들과 대화를 나눠요'/>
                <ScreenshotSection src={img4} title='함께 어울리기' lead='함께한 사람들과 친구를 맺어요'/>
            </div>
        </Fragment>

    );
};

export default withRedirect(Login);