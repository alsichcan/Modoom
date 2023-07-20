import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {Col, Form, Row} from 'reactstrap';
import CardSection from "../common/CardSection";
import {useForm} from "react-hook-form";
import {faUserFriends} from "@fortawesome/free-solid-svg-icons/faUserFriends";
import WizardInput from "../common/wizard-input/WizardInput";
import InteractionButton from "../common/InteractionButton";
import {axiosPost} from "../../actions/axios";
import urls, {appUrls} from "../../urls";
import {faMapMarkerAlt} from "@fortawesome/free-solid-svg-icons/faMapMarkerAlt";
import withRedirect from "../hoc/withRedirect";
import {toast} from 'react-toastify';
import AppContext from "../../context/Context";
import {defaultAppBarState} from "../../Main";
import KeywordSelect from "../common/KeywordSelect";
import InteractionButtonWrapperDiv from "../common/InteractionButtonWrapperDiv";
import useQuery from "../../hooks/useQuery";
import {useGA4React} from "ga-4-react";

const CreateModoom = ({setRedirect, setRedirectUrl}) => {
    const {setAppBarState} = useContext(AppContext);
    const [keywords, setKeywords] = useState([]);
    const [keywordError, setErrorMsg] = useState('');
    const {register, handleSubmit, errors, watch, trigger} = useForm({
        mode: 'onBlur',
        reValidateMode: 'onChange'
    });
    const query = useQuery();
    const defaultKeywords = query.get('keyword') && [{name: query.get('keyword')}];

    useLayoutEffect(() => {
        setAppBarState({...defaultAppBarState, title: '모둠 만들기'})
    }, [])

    const ga = useGA4React();
    const onSubmit = data => {
        axiosPost(null, urls().modoom, {...data}).then(data => {
            toast.success(data?.message);
            if (data?.success) {
                ga.gtag('event', 'create', {
                    'event_category': 'modoom',
                    'event_label': data.data.title
                });
                setRedirectUrl(appUrls().chats);
                setRedirect(true);
            }
        });
    };

    return (
        <Form>
            <CardSection>
                <WizardInput name='title'
                             placeholder={'모둠 이름'}
                             className='font-weight-bold'
                             innerRef={register({
                                 required: '모둠 이름은 필수입니다.',
                                 maxLength: {
                                     value: 40,
                                     message: '모둠 이름은 40자 이내로 작성해주세요.'
                                 }
                             })}
                             errors={errors}/>
                {/* 정원 */}
                <hr className='my-2 border-top-200'/>
                <Row>
                    <Col className='col-5'>
                        <WizardInput
                            type='number'
                            name='accom'
                            placeholder={'정원 (최대 12명)'}
                            errors={errors}
                            watch={watch}

                            icon={faUserFriends}
                            innerRef={register({
                                required: '정원은 필수입니다.',
                                min: {
                                    value: 2,
                                    message: '정원은 2명 이상 12명 이하로 설정할 수 있습니다.'
                                },
                                max: {
                                    value: 12,
                                    message: '정원은 2명 이상 12명 이하로 설정할 수 있습니다.'
                                }
                            })}
                        />
                    </Col>
                    <Col>
                        <WizardInput
                            type='text'
                            name='location'
                            placeholder={'지역 (선택)'}
                            errors={errors}
                            watch={watch}
                            icon={faMapMarkerAlt}
                            innerRef={register({
                                maxLength: {
                                    value: 20,
                                    message: '지역'
                                },
                            })}
                        />
                    </Col>
                </Row>
                <hr className='my-2 border-top-200'/>
                {/*<KeywordSelect setKeywords={setKeywords} placeholder='모둠의 키워드를 입력해주세요.' errorMsg={keywordError} defaultValue={defaultKeywords}/>*/}
                {/*<hr className='my-2 mb-3 border-top-200'/>*/}
                <WizardInput type='textarea'
                             name='content'
                             placeholder={"어떤 모둠인지 소개해주세요."}
                             rows={10}
                             innerRef={register({
                                 required: '어떤 모둠인지 소개해주세요.',
                             })}
                             errors={errors}
                />
            </CardSection>
            <InteractionButtonWrapperDiv>
                <InteractionButton text='완료' fill className='py-1' width='8rem' onClick={handleSubmit(onSubmit)}/>
            </InteractionButtonWrapperDiv>
        </Form>
    );
};

export default withRedirect(CreateModoom);