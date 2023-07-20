import React, {Fragment, useContext, useEffect} from 'react';
import {Row, Col} from 'reactstrap';
import AppContext, {ChatContext} from "../../../context/Context";
import {PromptText} from "../../auth/RegisterWizard/RegisterWizard";
import CardSection from "../../common/CardSection";
import WizardInput from "../../common/wizard-input/WizardInput";
import {useForm} from "react-hook-form";
import InteractionButton from "../../common/InteractionButton";
import {axiosPost} from "../../../actions/axios";
import urls from "../../../urls";
import InteractionButtonWrapperDiv from "../../common/InteractionButtonWrapperDiv";

const CreateChatRoom = () => {
    const {appBarState, setAppBarState} = useContext(AppContext);
    const {modoomId, refreshRooms} = useContext(ChatContext);
    const {register, errors, handleSubmit, setError} = useForm({mode: 'onSubmit', reValidateMode: 'onChange'});

    useEffect(() => {
        setAppBarState({...appBarState, useInfo: false, title: '채널 만들기'})
    }, []);

    const onSubmit = (data) => {
        axiosPost(null, urls({modoomId}).modoomChatRooms, {...data, modoom: modoomId}).then(data => {
            if (data?.success === false) {
                setError('name', 'server', data?.message);
                return;
            }
            refreshRooms();
            window.history.back();
        });
    };

    return (
        <Fragment>
            <div className='pt-5'>
                <PromptText>
                    채널의 이름을 입력해주세요.
                    <div className='fs--1 text-700 mt-2 word-break-keep-all'>
                        채널은 모둠원과 소통하는 공간입니다.<br/>
                        예: 공지방, 잡담방, 정산방, 인증방 등
                    </div>
                </PromptText>
                <CardSection className='px-3' hasPadding={false} hasMargin={false}>
                    <div className='px-3 py-1'>
                        <WizardInput type='text'
                                     name='name'
                                     placeholder={'20자 이내로 입력'}
                                     innerRef={register({
                                         required: '이름은 필수입니다.',
                                         maxLength: {
                                             value: 20,
                                             message: '20자 이내로 입력해주세요.'
                                         }
                                     })}
                                     errors={errors}
                        />
                    </div>
                </CardSection>
                <InteractionButtonWrapperDiv>
                    <InteractionButton text='완료' fill className='py-1' width='8rem' onClick={handleSubmit(onSubmit)}/>
                </InteractionButtonWrapperDiv>
            </div>
        </Fragment>
    );
};

export default CreateChatRoom;