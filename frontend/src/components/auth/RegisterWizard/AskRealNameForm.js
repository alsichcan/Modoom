import React, {Fragment, useContext} from 'react';
import {Row, Col, Form} from 'reactstrap';
import Logo from "../../common/Logo";
import CardSection from "../../common/CardSection";
import WizardInputInner from "../../common/wizard-input/WizardInputInner";
import {PromptText} from "./RegisterWizard";
import {RegisterWizardContext} from "../../../context/Context";
import WizardInput from "../../common/wizard-input/WizardInput";

const AskRealNameForm = ({register, errors}) => {
    const {handleInputChange} = useContext(RegisterWizardContext);
    return (
        <Form>
            <PromptText description={<span>믿을만한 사람들과 함께하는 <strong>모둠</strong>에서는 <strong>실명</strong>을 사용해요</span>}>
                회원님의 이름을 알려주세요!
            </PromptText>
            <Row noGutters>
                <Col>
                    <CardSection className='' hasPadding={false} hasMargin={false}>
                        <div className='px-3 py-1'>
                            <WizardInput type='text'
                                         name='last_name'
                                         placeholder={'성'}
                                         innerRef={register({
                                             required: '필수 항목',
                                         })}
                                         onChange={({target}) => {
                                             handleInputChange(target);
                                         }}
                                         errors={errors}
                            />
                        </div>
                    </CardSection>
                </Col>
                <Col>
                    <CardSection className='' hasPadding={false} hasMargin={false}>
                        <div className='px-3 py-1'>
                            <WizardInput type='text'
                                         name='first_name'
                                         placeholder={'이름'}
                                         onChange={({target}) => {
                                             handleInputChange(target);
                                         }}
                                         innerRef={register({
                                             required: '필수 항목',
                                         })}
                                         errors={errors}
                            />
                        </div>
                    </CardSection>
                </Col>
            </Row>
        </Form>

    )
};

export default AskRealNameForm;