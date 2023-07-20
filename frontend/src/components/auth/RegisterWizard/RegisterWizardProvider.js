import React, {useState} from 'react';
import {Row, Col} from 'reactstrap';
import {RegisterWizardContext} from "../../../context/Context";

const RegisterWizardProvider = ({children}) => {
    const [user, setUser] = useState({email: ''});
    const [step, setStep] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');

    const handleInputChange = ({value, name}) => {
        setUser({...user, [name]: value})
    };

    const value = {user, setUser, step, setStep, handleInputChange, errorMsg, setErrorMsg};
    return <RegisterWizardContext.Provider value={value}>{children}</RegisterWizardContext.Provider>;
};

export default RegisterWizardProvider;