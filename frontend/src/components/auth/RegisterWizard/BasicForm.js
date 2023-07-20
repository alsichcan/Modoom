import React, {useContext} from 'react';
import {Row, Col, Form} from 'reactstrap';
import CardSection from "../../common/CardSection";
import WizardInputInner from "../../common/wizard-input/WizardInputInner";
import {Link} from "react-router-dom";
import {appUrls} from "../../../urls";
import InteractionButton from "../../common/InteractionButton";
import {useForm} from "react-hook-form";
import Logo from "../../common/Logo";
import {PromptText} from "./RegisterWizard";
import {RegisterWizardContext} from "../../../context/Context";
import WizardInput from "../../common/wizard-input/WizardInput";

const BasicForm = ({register, errors, watch}) => {
    const {handleInputChange, user, setStep} = useContext(RegisterWizardContext);
    return (
        <Form>
            <PromptText>
                <span className=''>모둠에서 사용할 <br/> 아이디와 비밀번호를 설정해주세요!</span>
            </PromptText>
            <CardSection className='' hasPadding={false}>
                <div className='px-3 pt-2'>
                    <WizardInput type='text'
                                      name='username'
                                      placeholder={'아이디'}
                                      innerRef={register({
                                     required: '아이디를 입력해주세요.',
                                 })}
                                      onChange={({target}) => {
                                     handleInputChange(target);
                                 }}
                                      errors={errors}
                    />
                </div>
                <hr className='my-2 border-300'/>
                <div className='px-3'>
                    <WizardInput
                        type='password'
                        name='password'
                        placeholder={'비밀번호'}
                        onChange={({target}) => {
                            handleInputChange(target);
                        }}
                        innerRef={register({
                            required: '비밀번호를 입력해주세요.',
                        })}
                        errors={errors}
                    />
                </div>
                <hr className='my-2 border-300'/>
                <div className='px-3 pb-2 mb-3'>
                    <WizardInput
                        type='password'
                        name='password_confirm'
                        placeholder={'비밀번호 확인'}
                        onChange={({target}) => {
                            handleInputChange(target);
                        }}
                        innerRef={register({
                            required: '비밀번호를 입력해주세요.',
                        })}
                        errors={errors}
                    />
                </div>
            </CardSection>
        </Form>
    );
};

export default BasicForm;