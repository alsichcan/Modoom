import {
    USER_LOADING,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS, REGISTER_SUCCESS
} from '../actions/types';
import React from "react";

export const authReducer = (state, action) => {
    const {type, payload} = action;
    switch (type) {
        case USER_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case USER_LOADED:
            return {
                ...state,
                isLoading: false,
                isAuthenticated: true,
                user: payload
            };
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            payload.remember
                ? localStorage.setItem('modoom_token', payload.token)
                : sessionStorage.setItem('modoom_token', payload.token);
            return {
                ...state,
                isLoading: false,
                isAuthenticated: true,
                ...payload
            };
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
            state.remember
                ? localStorage.removeItem('modoom_token')
                : sessionStorage.removeItem('modoom_token');
            return {
                ...state,
                isLoading: false,
                isAuthenticated: false,
                user: null,
                token: null
            };
        default:
            return state;
    }
};
