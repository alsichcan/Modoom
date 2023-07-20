import React from 'react';
import {Row, Col, Label, CustomInput} from 'reactstrap';
import CardSection from "../../common/CardSection";
import WizardInput from "../../common/wizard-input/WizardInput";

const ProfileEmailSettings = ({profile, register, errors}) => {
    return (
        <CardSection>
            <Label>
                이메일 수신 동의
            </Label>
            <div>
                <CustomInput
                    type="checkbox"
                    id='receive_enroll_mails'
                    name="receive_enroll_mails"
                    label='모둠 내 중요 알림 (가입 신청, 수락 등)에 대한 알림 메일 수신에 동의합니다.'
                    defaultChecked={profile.receive_enroll_mails}
                    innerRef={register()}
                />
                <CustomInput
                    type="checkbox"
                    id="receive_news_mails"
                    name="receive_news_mails"
                    label='모둠의 소식을 구독합니다.'
                    defaultChecked={profile.receive_news_mails}
                    innerRef={register()}
                />
            </div>
            <hr className='border-300'/>
            <Label>
                자주 사용하는 이메일
            </Label>
            <WizardInput
                name='pref_email'
                defaultValue={profile.pref_email}
                placeholder='자주 사용하는 이메일 주소를 입력해주세요. 모둠의 소식을 입력하신 이메일로 보내드립니다.'
                errors={errors}
                innerRef={register()}
                type='text'/>
        </CardSection>
    );
};

export default ProfileEmailSettings;