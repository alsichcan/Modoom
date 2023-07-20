import React, {useReducer, useEffect, useState, useContext} from 'react';
import AppContext, {AuthContext} from '../../context/Context';
import {authReducer} from "../../reducers/authReducer";
import {loadUser} from "../../actions/auth";
import axios from "axios";
import {useGA4React} from "ga-4-react";
import {isDev, isInWebAppChrome, isInWebAppiOS} from "../../helpers/utils";

const AuthProvider = ({children}) => {
    const [authState, authDispatch] = useReducer(authReducer, {
        isLoading: false,
        isAuthenticated: false,
        user: null,
        remember: true,
        token: localStorage.getItem('modoom_token') || sessionStorage.getItem('modoom_token')
    });

    const ga = useGA4React();
    useEffect(() => {
        const source = axios.CancelToken.source();
        // token이 없으면 요청을 보내도 어차피 401 뜨기때문에 token이 있을때만 요청을 보낸다.
        if (authState.token) {
            loadUser(source, authDispatch);
        }
        return () => {
            source.cancel()
        };
    }, []);

    useEffect(() => {
        if (authState.user) {
            ga.gtag('set', {user_id: authState.user.uid})
            ga.gtag('set', 'user_properties', {user_id: authState.user.uid, pwaEnabled: (isInWebAppiOS || isInWebAppChrome)})
        }
    }, [ga, authState]);

    const value = {
        authState,
        authDispatch
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
