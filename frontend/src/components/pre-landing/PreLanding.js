import React, {Fragment} from 'react';
import logo from '../../assets/img/logos/logo_full.svg'
import img1 from "../../assets/img/screenshots/프로필-페이지.jpg"
import img2 from "../../assets/img/screenshots/사람소통-페이지.jpg"
import img3 from "../../assets/img/screenshots/모집중인-모둠-페이지.jpg"
import img4 from "../../assets/img/screenshots/채팅-페이지.jpg"
import ScreenshotSection from "./ScreenshotSection";
import Typed from 'react-typed';
import SubscribeInput from "./SubscribeInput";
import {CloseButton, Fade} from "../common/Toast";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css'

const PreLanding = () => {
    return (
        <Fragment>
            <div className='bg-white'>
                <div className='container text-center pt-6 pb-4'>
                    <div className='fs-1 mb-3 font-weight-normal text-900'>
                        <span>
                            <Typed
                                strings={['마음 맞는', '믿을 만한', '새로운']}
                                typeSpeed={110}
                                backSpeed={50}
                                className="font-weight-bold pl-2"
                                loop
                            />
                         사람들과 함께하는 곳
                        </span>
                    </div>
                    <img src={logo} style={{width: '15rem'}} alt='modoom'/>
                    <div className='my-4 text-900 font-weight-medium'>
                        <div>
                            베타서비스
                        </div>
                        <div className='fs-1 my-1'>
                            Coming Soon
                        </div>
                        <div className='fs-0'>
                            서울대학교 | 2021. 03. 01
                        </div>
                    </div>
                    <div className='mt-3 d-flex justify-content-center'>
                        <SubscribeInput/>
                    </div>
                </div>
            </div>
            <div className='mb-6'>
                <ScreenshotSection src={img1} title='나를 표현하기' lead='나를 대표하는 키워드를 자유롭게 만들고 선택해요'/>
                <ScreenshotSection src={img2} title='자유롭게 소통하기' lead='키워드 커뮤니티에서 사람들과 편하게 대화해요'/>
                <ScreenshotSection src={img3} title='모둠 구성하기' lead='마음 맞는 사람들과 함께 모둠을 이루어요'/>
                <ScreenshotSection src={img4} title='함께 어울리기' lead='모둠원들과 언제든지 소통하고 어디서든 함께해요'/>
            </div>
            <div className='mt-5 bg-white pt-6 pb-7'>
                <div className='text-center'>
                    <div
                        className='text-900 fs-3 font-weight-bold my-2'>
                        <img src={logo} style={{width: '10rem'}} alt='modoom' className='mr-1 align-middle'/>
                        <span className='align-middle'>의 소식이 <br/>더 궁금하시다면...</span>
                    </div>
                </div>
                <div className='mt-4 d-flex justify-content-center'>
                    <SubscribeInput/>
                </div>
            </div>
            <ToastContainer transition={Fade} closeButton={<CloseButton/>} position={toast.POSITION.BOTTOM_LEFT}/>
        </Fragment>

    );
};

export default PreLanding;