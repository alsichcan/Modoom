import React, {Fragment, useState} from 'react';
import {Input} from 'reactstrap';
import InteractionButton from "../common/InteractionButton";
import {axiosPost} from "../../actions/axios";
import urls from "../../urls";
import {toast} from 'react-toastify';

const SubscribeInput = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubscribe = () => {
        if (email === '') {
            return
        }
        setLoading(true);
        axiosPost(null, urls().subscribe, {email: email}).then(data => {
            setLoading(false);
            if (data?.success) {
                toast.success("구독 신청이 완료되었습니다 🎉");
            } else if (data?.message) {
                toast.error(data?.message);
            }
        });
    };

    return (
        <Fragment>
            <Input placeholder='이메일을 입력해주세요.' value={email} onChange={e => {
                setEmail(e.target.value);
            }}
                   bsSize='md' autoComplete="off" name='notASearchField' type='email'
                   className="rounded-pill search-input mr-2" style={{width: '15rem'}}/>
            <InteractionButton text='소식 받기' icon='Mail' highlight isLoading={loading} loadingText='구독 중'
                               onClick={onSubscribe} width='6rem'/>
        </Fragment>
    );
};

export default SubscribeInput;