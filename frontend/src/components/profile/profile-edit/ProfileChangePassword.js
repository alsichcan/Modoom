import React from 'react';
import {Row, Col, Label} from 'reactstrap';
import CardSection from "../../common/CardSection";
import WizardInput from "../../common/wizard-input/WizardInput";
import {useForm} from "react-hook-form";
import InteractionButton from "../../common/InteractionButton";
import {axiosPost} from "../../../actions/axios";
import urls from "../../../urls";
import {toast} from "react-toastify";

const ProfileChangePassword = () => {
    const {register, errors, handleSubmit, reset} = useForm({
        mode: "onSubmit",
        reValidateMode: "onChange",
    })

    const onSubmit = formData => {
        axiosPost(null, urls().changePassword, formData).then(data => {
            if (data?.success) {
                reset({current_password: '', password1: '', password2: ''});
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        });
    };

    return (
        <CardSection>
            <Label>
                현재 비밀번호
            </Label>
            <WizardInput
                name='current_password'
                placeholder='현재 비밀번호를 입력하세요.'
                errors={errors}
                innerRef={register()}
                type='password'
            />
            <hr className='border-300'/>
            <Row>
                <Col>
                    <Label>
                        새 비밀번호
                    </Label>
                    <WizardInput
                        name='password1'
                        placeholder='새로운 비밀번호를 입력하세요.'
                        errors={errors}
                        innerRef={register()}
                        type='password'/>
                </Col>
                <Col>
                    <Label>
                        새 비밀번호 확인
                    </Label>
                    <WizardInput
                        name='password2'
                        placeholder='새로운 비밀번호를 입력하세요.'
                        errors={errors}
                        innerRef={register()}
                        type='password'/>
                </Col>
            </Row>
            <InteractionButton text='비밀번호 변경' className='py-1 mt-3' onClick={handleSubmit(onSubmit)}/>
        </CardSection>
    );
};

export default ProfileChangePassword;