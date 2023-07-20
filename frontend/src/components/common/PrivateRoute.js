import React, {useContext} from 'react';
import {Redirect, Route} from 'react-router-dom';

import {appUrls} from "../../urls";
import {AuthContext} from "../../context/Context";
import logo_placeholder from '../../assets/img/logos/logo-300.svg'

const LoadingScreen = () => {
    return (
        <div className='min-vh-100 d-flex flex-center opacity-75'>
            <img src={logo_placeholder} alt='loading' width={80}/>
        </div>
    )
};

const PrivateRoute = ({component: Component, location, ...rest}) => {
    const {authState} = useContext(AuthContext);
    return (
        <Route
            {...rest}
            render={props => {
                if (authState.isLoading) {
                    return <LoadingScreen/>;
                } else if (authState.token && !authState.isAuthenticated) {
                    return <LoadingScreen/>;
                } else if (!authState.isAuthenticated) {
                    return <Redirect to={{
                        pathname: appUrls().login,
                        state: {referrer: location.pathname}  // url 파라미터까지 유지하기 위해 path가 아닌 location.pathname 이용
                    }}
                    />;
                } else {
                    return <Component {...props}/>;
                }
            }}
        />
    );
};

export default PrivateRoute;