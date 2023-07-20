import React, {useState} from 'react';
import {Row, Col} from 'reactstrap';
import {PromptText} from "./RegisterWizard/RegisterWizard";
import CardSection from "../common/CardSection";
import WizardInput from "../common/wizard-input/WizardInput";
import InteractionButton from "../common/InteractionButton";
import {axiosPost} from "../../actions/axios";
import urls from "../../urls";
import {toast} from "react-toastify";

const ForgotUsername = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const onSendUsername = () => {
        setLoading(true)
        axiosPost(null, urls().findUsername, {email: email.trim()}).then(data => {
            setLoading(false)
            if (!!!data) {
                return
            }
            if (data.success) {
                toast.success(data.data + '로 아이디가 전송되었습니다. 이메일이 오지 않으면 스팸메일함을 확인해주세요!');
            } else {
                toast.error(data.message || '가입 정보를 찾을 수 없습니다. 이메일을 다시 한 번 확인해주세요.');
            }
        });
    };

    return (
        <div className='container mt-10'>
            <PromptText description='SNU 메일 주소로 아이디를 보내드리겠습니다.'>
                가입 시 입력하신 <strong className='font-weight-bold'>SNU 메일</strong>을 입력해주세요.
            </PromptText>
            <CardSection hasPadding={false} hasMargin={false}>
                <Row noGutters>
                    <Col>
                        <div className='px-2 py-1'>
                            <WizardInput type='text'
                                         name='email'
                                         placeholder={'example@snu.ac.kr'}
                                         onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                    </Col>
                    <Col className='col-auto d-flex p-1'>
                        <InteractionButton text='전송하기' onClick={onSendUsername} isLoading={loading}/>
                    </Col>
                </Row>
            </CardSection>
        </div>
    );
};

export default ForgotUsername;