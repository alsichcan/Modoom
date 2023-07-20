import urls from "../urls";
import axios from 'axios';
import {axiosCancelHandler, getConfig} from "./auth";

export const axiosGet = async (cancelTokenSource, url, params) => {
    try {
        const res = await axios.get(url, getConfig(cancelTokenSource, params));
        return res.data
    } catch (e) {
        axiosCancelHandler(e);
    }
};

export const axiosPost = async (cancelTokenSource, url, data) => {
    try {
        const res = await axios.post(url, data, getConfig(cancelTokenSource));
        return res.data;
    } catch (e) {
        axiosCancelHandler(e);
    }
};

export const axiosDelete = async (cancelTokenSource, url, data) => {
    try {
        const res = await axios.delete(url, {
            ...getConfig(cancelTokenSource),
            data: data
        });
        return res.data;
    } catch (e) {
        axiosCancelHandler(e);
    }
};


export const axiosPatch = async (cancelTokenSource, url, data) => {
    try {
        const res = await axios.patch(url, data, getConfig(cancelTokenSource));
        return res.data;
    } catch (e) {
        axiosCancelHandler(e);
    }
};