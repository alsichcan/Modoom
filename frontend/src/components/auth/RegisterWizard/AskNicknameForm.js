import React, {useContext} from 'react';
import {Row, Col, Form} from 'reactstrap';
import CardSection from "../../common/CardSection";
import WizardInputInner from "../../common/wizard-input/WizardInputInner";
import {PromptText} from "./RegisterWizard";
import {RegisterWizardContext} from "../../../context/Context";
import WizardInput from "../../common/wizard-input/WizardInput";

const AskNicknameForm = ({register, errors, watch}) => {
    const {handleInputChange} = useContext(RegisterWizardContext);
    return (
        <Form>
            <PromptText description={<span>이 별명은 동명이인과 구분하기 위해 사용돼요. <strong>소문자, 숫자, 특수문자로만 입력해주세요!</strong></span>}>
                회원님의 별명을 입력해주세요!
            </PromptText>
            <CardSection className='' hasPadding={false}>
                <div className='px-3 py-1'>
                    <WizardInput type='text'
                                 featherIcon='AtSign'
                                 name='nickname'
                                 placeholder='love._.modoom'
                                 innerRef={register({
                                     required: '별명을 입력해주세요.'
                                 })}
                                 watch={watch}
                                 errors={errors}
                                 onChange={({target}) => {
                                     handleInputChange(target);
                                 }}
                                 onKeyPress={e => {
                                     if (e.key === 'Enter') {
                                         e.preventDefault();
                                     }
                                }}
                    />
                </div>
            </CardSection>
        </Form>
    );
};

export default AskNicknameForm;