import React, {Fragment, useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import AppContext, {AuthContext, ProfileContext} from "../../../context/Context";
import {defaultAppBarState, defaultModalState} from "../../../Main";
import CardSection from "../../common/CardSection";
import {useForm} from "react-hook-form";
import WizardInput from "../../common/wizard-input/WizardInput";
import {Col, Label, Row} from "reactstrap";
import KeywordSelect from "../../common/KeywordSelect";
import InteractionButton from "../../common/InteractionButton";
import InteractionButtonWrapperDiv from "../../common/InteractionButtonWrapperDiv";
import {axiosDelete, axiosGet, axiosPatch} from "../../../actions/axios";
import urls, {appUrls} from "../../../urls";
import {useHistory} from 'react-router-dom';
import {toast} from 'react-toastify';
import {LOGOUT_SUCCESS, USER_LOADED} from "../../../actions/types";
import Avatar from "../../common/Avatar";
import Resizer from 'react-image-file-resizer';
import classNames from 'classnames';
import ProfileEmailSettings from "./ProfileEmailSettings";
import ProfileChangePassword from "./ProfileChangePassword";

const ProfileEdit = () => {
    const {authState, authDispatch} = useContext(AuthContext);
    const {nickname, profile, setProfile, refresh} = useContext(ProfileContext);
    const {setAppBarState, setModalState} = useContext(AppContext);
    const [keywords] = useState([]);
    const history = useHistory();
    const inputFile = useRef(null);
    const {register, errors, watch, handleSubmit, setValue} = useForm({
        mode: "onSubmit",
        reValidateMode: "onChange",
    })
    const [withDrawing, setWithdrawing] = useState(false);

    const onWithdraw = () => {
        setWithdrawing(true);
        axiosDelete(null, urls({nickname}).profileDetail).then(data => {
            setWithdrawing(false);
            if (data?.success) {
                authDispatch({
                    type: LOGOUT_SUCCESS
                });
                history.push(appUrls().login);
                toast(data.message);
            } else {
                toast.error('알 수 없는 오류가 발생했습니다. admin@modoom.us로 문의해주시기 바랍니다.');
            }
        });
    };

    const onClickWithdraw = () => {
        setModalState({
            ...defaultModalState,
            isOpen: true,
            title: '모둠에서 탈퇴하시겠습니까?',
            content: '개설한 모둠과 작성하신 댓글이 모두 삭제됩니다. 이 작업은 되돌릴 수 없습니다.',
            onConfirm: onWithdraw
        })
    };

    useLayoutEffect(() => {
        if (nickname !== authState.user.nickname) {
            history.push(appUrls().home);
        }
        setAppBarState({...defaultAppBarState, title: '프로필 편집', useBackButton: true});
    }, []);

    const onSubmit = data => {
        axiosPatch(null, urls({nickname: profile.nickname}).profileDetail, {...data, keywords: keywords}).then(data => {
            if (data?.success === false) {
                toast.error(data?.message);
                return
            }
            if (data.nickname !== authState.user.profile) {
                // 별명을 바꾼 경우 authState의 별명도 바꿔준다.
                authDispatch({
                    type: USER_LOADED,
                    payload: {...authState.user, nickname: data.nickname}
                });
            }
            history.push(appUrls({nickname: data.nickname}).profile);
            refresh();
        });
    };

    const resizeFile = (file) => new Promise(resolve => {
        Resizer.imageFileResizer(file, 500, 500, 'JPEG', 80, 0,
            uri => {
                resolve(uri);
            },
            'file'
        );
    });

    const onChangeAvatar = async (event) => {
        const file = event.target.files[0];
        const image = await resizeFile(file);
        const data = new FormData();
        data.append('image', image);
        axiosPatch(null, urls({nickname: profile.nickname}).profileDetail, data).then(data => {
            setProfile({...profile, image: data.image});
        });
    };

    return (
        <Fragment>
            <div className='d-flex flex-center mt-4 mb-3'>
                <div className='cursor-pointer' onClick={() => {
                    inputFile.current.click()
                }}>
                    <Avatar
                        src={profile.image}
                        name={profile.first_name || ' '}
                        rounded="circle"
                        className='align-middle'
                        size='4xl'
                        mediaClass='bg-primary custom-shadow'
                        style={{width: '6rem', height: '6rem'}}
                    />
                    <input id="myInput"
                           type="file"
                           ref={inputFile}
                           style={{display: 'none'}}
                           accept=".jpg, .jpeg, .png"
                           onChange={onChangeAvatar}
                    />
                </div>
            </div>
            <div className='text-center fs-0 mb-3 font-weight-medium text-primary cursor-pointer' onClick={() => {
                inputFile.current.click()
            }}>
                프로필 사진 편집
            </div>
            <CardSection>
                <Label>
                    이름
                </Label>
                <Row>
                    <Col>
                        <WizardInput
                            defaultValue={profile.last_name}
                            name='last_name'
                            className='text-500'
                            type='text'
                            placeholder='성'
                            disabled
                        />
                    </Col>
                    <Col>
                        <WizardInput
                            defaultValue={profile.first_name}
                            name='first_name'
                            className='text-500'
                            type='text'
                            placeholder='이름'
                            disabled
                        />
                    </Col>
                </Row>
                <div className='fs--2 text-800 font-weight-medium'>
                    지금은 이름을 변경할 수 없어요. 모둠이에게 문의해주세요.
                </div>
                <hr className='border-300'/>
                <Label>
                    별명
                </Label>
                <WizardInput
                    defaultValue={profile.nickname}
                    name='nickname'
                    type='text'
                    featherIcon='AtSign'
                    watch={watch}
                    errors={errors}
                    innerRef={register({})}
                />
                {/*<hr className='border-300'/>*/}
                {/*<Label className='mb-1'>*/}
                {/*    키워드*/}
                {/*</Label>*/}
                {/*{profile.keywords && <KeywordSelect setKeywords={setKeywords} defaultValue={profile.keywords}/>}*/}
                <hr className='border-300'/>
                <Label>
                    소개
                </Label>
                <WizardInput
                    name='bio'
                    defaultValue={profile.bio}
                    placeholder='이곳에서 회원님에 대해 소개해주세요.'
                    errors={errors}
                    innerRef={register({
                        maxLength: {
                            value: 1000,
                            message: '최대 1000자까지 작성하실 수 있습니다.'
                        }
                    })}
                    rows={5}
                    type='textarea'/>
            </CardSection>
            <ProfileEmailSettings profile={profile} register={register} errors={errors}/>
            <ProfileChangePassword/>
            <InteractionButtonWrapperDiv>
                <InteractionButton text='저장' fill className='py-1' width='8rem' onClick={handleSubmit(onSubmit)}/>
            </InteractionButtonWrapperDiv>
            <div className={classNames('container text-center mb-3 fs--1', {'cursor-wait opacity-50': withDrawing})}>
                <a href='' onClick={e => {
                    e.preventDefault();
                    onClickWithdraw();
                }}>
                    회원 탈퇴
                </a>
            </div>
        </Fragment>
    );
};

export default ProfileEdit;