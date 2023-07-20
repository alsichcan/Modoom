import React, {useContext, useLayoutEffect, useState} from 'react';
import {Form} from 'reactstrap';
import CardSection from "../common/CardSection";
import {useForm} from "react-hook-form";
import WizardInput from "../common/wizard-input/WizardInput";
import InteractionButton from "../common/InteractionButton";
import {axiosPost} from "../../actions/axios";
import urls, {appUrls} from "../../urls";
import withRedirect from "../hoc/withRedirect";
import {toast} from 'react-toastify';
import AppContext from "../../context/Context";
import {defaultAppBarState} from "../../Main";
import KeywordSelect from "../common/KeywordSelect";
import InteractionButtonWrapperDiv from "../common/InteractionButtonWrapperDiv";
import useQuery from "../../hooks/useQuery";

const CreatePost = ({setRedirect, setRedirectUrl}) => {
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
        setAppBarState({...defaultAppBarState, title: '글 쓰기'})
    }, [])

    const onSubmit = data => {
        if (keywords.length ===0) {
            setErrorMsg('키워드를 하나 이상 입력해주세요.')
            return
        }
        axiosPost(null, urls().post, {...data, keywords: keywords}).then(data => {
            toast.success(data?.message);
            if (data?.success) {
                setRedirectUrl(appUrls().home);
                setRedirect(true);
            }
        });
    };

    return (
        <Form>
            <CardSection>
                <WizardInput name='title'
                             placeholder={'제목'}
                             className='font-weight-bold'
                             innerRef={register({
                                 required: '제목은 필수입니다.'
                             })}
                             errors={errors}/>
                <hr className='my-2 border-top-200'/>
                <KeywordSelect setKeywords={setKeywords} placeholder='글의 키워드를 입력해주세요.' errorMsg={keywordError} defaultValue={defaultKeywords}/>
                <hr className='my-2 mb-3 border-top-200'/>
                <WizardInput type='textarea'
                             name='content'
                             placeholder={"자유롭게 글을 작성해주세요."}
                             rows={10}
                             innerRef={register({
                                 required: '본문은 필수입니다.'
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

export default withRedirect(CreatePost);