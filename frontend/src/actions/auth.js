import axios from 'axios';

import {
    USER_LOADING,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGOUT_SUCCESS
} from './types';
import urls from '../urls'
import {isDev} from "../helpers/utils";


// LOAD USER
export const loadUser = async (cancelTokenSource, dispatch) => {
    dispatch({type: USER_LOADING});
    try {
        const res = await axios.get(urls().authenticate, getConfig(cancelTokenSource, null, ((status) => status >= 200 && status < 300)));
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
        return res.data;
    } catch (e) {
        axiosCancelHandler(e);
        dispatch({
            type: AUTH_ERROR
        });
    }
};

// LOGIN USER
export const login = ({username, password, remember, reset}) => async (cancelTokenSource, dispatch) => {
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        },
        validateStatus: (status) => status >= 200 && status < 300,
        cancelToken: cancelTokenSource?.token,
    };

    // Request Body
    const body = JSON.stringify({username: username, email: username, password: password, reset: reset});

    try {
        const res = await axios.post(urls().login, body, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: {
                ...res.data,
                remember: remember
            }
        });
        return res.data;
    } catch (e) {
        axiosCancelHandler(e);
        dispatch({
            type: LOGIN_FAIL
        });
        throw e.response;
    }
};

// REGISTER USER
export const register = (body) => async (cancelTokenSource, dispatch) => {
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        },
        cancelToken: cancelTokenSource?.token,
    };

    // Request Body
    const stringifiedBody = JSON.stringify(body);

    try {
        const res = await axios.post(urls().register, stringifiedBody, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
    } catch (e) {
        axiosCancelHandler(e);
        dispatch({
            type: REGISTER_FAIL
        });
    }
};

// LOGOUT USER
export const logout = async (cancelTokenSource, dispatch) => {
    const source = axios.CancelToken.source();
    try {
        await axios.post(urls().logout, null, getConfig(source));
        dispatch({
            type: LOGOUT_SUCCESS
        });
    } catch (e) {
        axiosCancelHandler(e);
    }

};


// SendVerifyPasswordResetCode
export const resetCode = async (cancelTokenSource, email, code = null) => {
    const source = axios.CancelToken.source();
    try {
        if (code) {
            // 초기화 코드와 이메일을 검증한다.
            const res = await axios.get(urls().resetCode, getConfig(source, {email: email, code: code}));
            return res.data;
        } else {
            // 초기화 코드를 이메일로 보낸다.
            const res = await axios.post(urls().resetCode, {email: email}, getConfig(source));
            return res.data;
        }
    } catch (e) {
        axiosCancelHandler(e);
    }
};


export const resetPassword = async (cancelTokenSource, email, code, password, confirmPassword) => {
    try {
        if (code) {
            const res = await axios.post(urls().resetPasswordCode, {
                email: email,
                code: code,
                password: password,
                confirm_password: confirmPassword
            }, getConfig(cancelTokenSource));
            return res.data;
        }
    } catch (e) {
        axiosCancelHandler(e);
    }
};


// helper function
export const getConfig = (cancelTokenSource, params, validateStatus) => {
    // Get token
    const token = localStorage.getItem('modoom_token') || sessionStorage.getItem('modoom_token');

    // Headers
    const config = {
        params: params,
        validateStatus: validateStatus || ((status) => status >= 200 && status < 500),  // 200이상 500 이하 요청은 허용(오류를 발생시키지 않음)
        cancelToken: cancelTokenSource?.token,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (token) {
        config.headers['Authorization'] = `Token ${token}`;
    }

    return config;
};

export const axiosCancelHandler = (e) => {
    if (!isDev()) {
        return
    }

    if (axios.isCancel(e)) {
        console.log('Component Unmounted');
    } else {
        console.log('에러 내용', e);
    }
};