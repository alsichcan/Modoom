import React, {Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.min.css'
import PrivateRoute from "../components/common/PrivateRoute";
import AuthLayout from "./AuthLayout";
import AppLayout from "./AppLayout";
import ErrorLayout from "./ErrorLayout";
import {appUrls} from "../urls";
import Terms from "../components/terms/Terms";
import Privacy from "../components/terms/Privacy";
import {CloseButton, Fade} from "../components/common/Toast";
import {toast, ToastContainer} from "react-toastify";
import GenericModal from "../components/modals/GenericModal";


const Layout = () => {
    return (
        <Fragment>
            <Switch>
                <Route path={appUrls().terms} exact component={Terms}/>
                <Route path={appUrls().privacy} exact component={Privacy}/>
                <Route path="/auth/" component={AuthLayout}/>
                <Route path="/errors" component={ErrorLayout}/>
                <PrivateRoute path={'/'} component={AppLayout}/>
            </Switch>
            <GenericModal/>
            <ToastContainer transition={Fade} closeButton={<CloseButton/>} position={toast.POSITION.BOTTOM_LEFT}/>
        </Fragment>
    );
};

export default Layout;
