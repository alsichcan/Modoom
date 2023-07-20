import React from 'react';
import {Row, Col} from 'reactstrap';
import {Redirect, Route, Switch} from "react-router-dom";
import Login from "../components/auth/Login";
import RegisterWizard from "../components/auth/RegisterWizard/RegisterWizard";
import RegisterWizardProvider from "../components/auth/RegisterWizard/RegisterWizardProvider";
import {appUrls} from "../urls";
import RegisterComplete from "../components/auth/RegisterWizard/RegisterComplete";
import PasswordReset from "../components/auth/PasswordReset";
import ForgotUsername from "../components/auth/ForgotUsername";

const AuthLayout = ({match: {url}}) => {
    return (
        <Switch>
            <Route path={appUrls().login} exact component={Login}/>
            <Route path={appUrls().passwordReset} exact component={PasswordReset}/>
            <Route path={appUrls().forgotUsername} exact component={ForgotUsername}/>
            <RegisterWizardProvider>
                <Route path={appUrls().register} exact component={RegisterWizard}/>
                <Route path={appUrls().registerComplete} exact component={RegisterComplete}/>
            </RegisterWizardProvider>
            {/*Redirect*/}
            <Redirect to="/errors/404"/>
        </Switch>
    );
};

export default AuthLayout;