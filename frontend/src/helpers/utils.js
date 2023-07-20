import moment from 'moment';
import React from "react";
import {appUrls} from "../urls";

export const isIterableArray = array => Array.isArray(array) && !!array.length;

// Internet Explorer 6-11
export const detectIE = () => {
    if (window.MSCompatibleInfo != null) {
        alert('현재 인터넷 익스플로러는 지원하지 않고 있습니다. 크롬이나 엣지, 웨일, 사파리 등 다른 브라우저를 이용해주세요! 불편을 드려 죄송합니다 (_ _)');
        throw new Error('현재 인터넷 익스플로러는 지원하지 않고 있습니다. 크롬이나 엣지, 웨일, 사파리 등 다른 브라우저를 이용해주세요! 불편을 드려 죄송합니다 (_ _)');
    }
};

//===============================
// Store
//===============================
export const getItemFromStore = (key, defaultValue, store = localStorage) =>
    JSON.parse(store.getItem(key)) || defaultValue;
export const setItemToStore = (key, payload, store = localStorage) => store.setItem(key, JSON.stringify(payload));
export const getStoreSpace = (store = localStorage) =>
    parseFloat((escape(encodeURIComponent(JSON.stringify(store))).length / (1024 * 1024)).toFixed(2));

//===============================
// Moment
//===============================
export const getDuration = (startDate, endDate) => {
    if (!moment.isMoment(startDate)) throw new Error(`Start date must be a moment object, received ${typeof startDate}`);
    if (endDate && !moment.isMoment(endDate))
        throw new Error(`End date must be a moment object, received ${typeof startDate}`);

    return `${startDate.format('ll')} - ${endDate ? endDate.format('ll') : 'Present'} • ${startDate.from(
        endDate || moment(),
        true
    )}`;
};

export const numberFormatter = (number, fixed = 2) => {
    // Nine Zeroes for Billions
    return Math.abs(Number(number)) >= 1.0e9
        ? (Math.abs(Number(number)) / 1.0e9).toFixed(fixed) + 'B'
        : // Six Zeroes for Millions
        Math.abs(Number(number)) >= 1.0e6
            ? (Math.abs(Number(number)) / 1.0e6).toFixed(fixed) + 'M'
            : // Three Zeroes for Thousands
            Math.abs(Number(number)) >= 1.0e3
                ? (Math.abs(Number(number)) / 1.0e3).toFixed(fixed) + 'K'
                : Math.abs(Number(number)).toFixed(fixed);
};

//===============================
// Custom Helper Functions
//===============================

export const isInWebAppiOS = (window.navigator.standalone === true);
export const isInWebAppChrome = (window.matchMedia('(display-mode: standalone)').matches);

export const checkRedirect404 = (data, history, main) => {
    if (data && data.status_code === 404) {
        history.push(appUrls().error404);
    } else (
        main()
    );
};

// React 개발 버전 / 프로덕션 빌드 구분
export const isDev = () => {
    return !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
};

// 모바일 에이전트 구분
export function isMobile() {
    try {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
    } catch (e) {
        return false;
    }
}

export const chunk = (arr, len) => {
    let chunks = [],
        i = 0,
        n = arr.length;
    while (i < n) {
        chunks.push(arr.slice(i, i += len));
    }
    return chunks;
}


export const truncateNumber = (number) => {
    const num = Math.abs(Number(number));
    const res = num >= 100000000
        ? (num / 100000000).toFixed(1) + '억'
        :
        num >= 10000
            ? (num / 10000).toFixed(1) + '만'
            : intComma(num);
    return res?.replace(/[.][0]/g, "")

};

export const numberToKorean = (price, won = true) => {
    if (price === 0) {
        return '0 원'
    }
    let inputNumber = price < 0 ? false : price;
    let unitWords = [' ', '만 ', '억 ', '조 ', '경 '];
    let splitUnit = 10000;
    let splitCount = unitWords.length;
    let resultArray = [];
    let resultString = '';

    for (let i = 0; i < splitCount; i++) {
        let unitResult = (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i);
        unitResult = Math.floor(unitResult);
        if (unitResult > 0) {
            resultArray[i] = unitResult;
        }
    }

    for (let i = 0; i < resultArray.length; i++) {
        if (!resultArray[i]) continue;
        resultString = String(resultArray[i]) + unitWords[i] + resultString;
    }
    return resultString + '원';
};

export const intComma = (x, useNegative = false) => {
    if (x === null) {
        return null;
    } else {
        switch (true) {
            case x >= 0:
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            case x < 0:
                return (useNegative ? '-' : '') + x.toString().replace('-', '').replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            default:
                return null
        }
    }
};

export const phoneNumFormatter = (str) => {
    return str.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3");
};

export const ISODateToString = (ISOString, type = null) => {
    let date;
    if (ISOString === 'NOW') {
        date = new Date();
    } else {
        date = new Date(ISOString + '+09:00');  // Chrome과 Safari에서 동일한 결과를 얻기 위해 필요하다.
    }
    const dateData = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes(),
        second: (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds()
    };

    let returnString;
    switch (type) {
        case null:
            returnString = `${dateData.year}년 ${dateData.month}월 ${dateData.day}일 ${dateData.hour}:${dateData.minute}`;
            break;
        case 'DATE':
            returnString = `${dateData.year}.${dateData.month}.${dateData.day}`;
            break;
        case 'LOG':
            returnString = `${dateData.year}-${dateData.month}-${dateData.day} ${dateData.hour}:${dateData.minute}:${dateData.second} `
            break;
        case 'DATE2':
            returnString = `${dateData.year}년 ${dateData.month}월 ${dateData.day}일`;
            break;
        default:
            returnString = 'type 파라미터가 유효하지 않습니다.';
            break;
    }

    return ISOString ? returnString : null
};

export const getPaginationString = ({sizePerPage, totalSize, page, unit = '개'}) => {
    const quotient = totalSize / (sizePerPage * page);
    const remainder = totalSize % sizePerPage;

    const from = sizePerPage * (page - 1) + 1;
    const to = quotient >= 1 ? sizePerPage * page : from + remainder - 1;
    return `총 ${totalSize}${unit} 중 ${from}-${to}번 째 (${page} 페이지)`
};


export const downloadCSV = (data, filename, type) => {
    const file = new Blob(["\uFEFF" + data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        const a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

//===============================
// Colors
//===============================

export const hashCode = (str) => { // java String#hashCode
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
};

export const intToRGB = (i) => {
    const c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
};

export const hexToRgb = hexValue => {
    let hex;
    hexValue.indexOf('#') === 0 ? (hex = hexValue.substring(1)) : (hex = hexValue);
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
        hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)
    );
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
};

export const rgbColor = (color = colors[0]) => `rgb(${hexToRgb(color)})`;
export const rgbaColor = (color = colors[0], alpha = 0.5) => `rgba(${hexToRgb(color)},${alpha})`;

export const colors = [
    '#2c7be5',
    '#00d97e',
    '#e63757',
    '#39afd1',
    '#fd7e14',
    '#02a8b5',
    '#727cf5',
    '#6b5eae',
    '#ff679b',
    '#f6c343'
];

export const themeColors = {
    primary: '#4F9ADD',
    secondary: '#748194',
    success: '#36b37e',
    info: '#27bcfd',
    warning: '#f5803e',
    danger: '#EF6C64',
    light: '#f9fafd',
    dark: '#0b1727'
};

export const gradientPrimary = {
    100: '#d1e6ff',
    300: '#a3cef1',
    500: '#6ea1db',
    700: '#4780cc',
    900: '#0069cc',
};

export const grays = {
    white: '#fff',
    100: '#f9fafd',
    200: '#edf2f9',
    300: '#d8e2ef',
    400: '#b6c1d2',
    500: '#9da9bb',
    600: '#748194',
    700: '#5e6e82',
    800: '#4d5969',
    900: '#344050',
    1000: '#232e3c',
    1100: '#0b1727',
    black: '#000'
};

export const darkGrays = {
    white: '#fff',
    1100: '#f9fafd',
    1000: '#edf2f9',
    900: '#d8e2ef',
    800: '#b6c1d2',
    700: '#9da9bb',
    600: '#748194',
    500: '#5e6e82',
    400: '#4d5969',
    300: '#344050',
    200: '#232e3c',
    100: '#0b1727',
    black: '#000'
};

export const getGrays = isDark => (isDark ? darkGrays : grays);

export const rgbColors = colors.map(color => rgbColor(color));
export const rgbaColors = colors.map(color => rgbaColor(color));

//===============================
// Echarts
//===============================
export const getPosition = (pos, params, dom, rect, size) => ({
    top: pos[1] - size.contentSize[1] - 10,
    left: pos[0] - size.contentSize[0] / 2
});

//===============================
// E-Commerce
//===============================
export const calculateSale = (base, less = 0, fix = 2) => (base - base * (less / 100)).toFixed(fix);
export const getTotalPrice = (cart, baseItems) =>
    cart.reduce((accumulator, currentValue) => {
        const {id, quantity} = currentValue;
        const {price, sale} = baseItems.find(item => item.id === id);
        return accumulator + calculateSale(price, sale) * quantity;
    }, 0);

//===============================
// Helpers
//===============================
export const getPaginationArray = (totalSize, sizePerPage) => {
    const noOfpages = Math.ceil(totalSize / sizePerPage);
    const array = [];
    let pageNo = 1;
    while (pageNo <= noOfpages) {
        array.push(pageNo);
        pageNo = pageNo + 1;
    }
    return array;
};

export const getPaginationArrayTruncated = (currentPage, totalSize, maxLength, sizePerPage) => {
    if (maxLength % 2 === 0) {
        throw Error;
    }

    const noOfpages = Math.ceil(totalSize / sizePerPage);

    if (noOfpages <= maxLength) {
        return range(1, noOfpages)
    }

    const side = (maxLength - 1) / 2;
    let minPage = currentPage - side < 1 ? 1 : currentPage - side;
    let maxPage = currentPage + side > noOfpages ? noOfpages : currentPage + side;

    if (maxPage - minPage + 1 < maxLength) {
        maxPage === noOfpages ? minPage = maxPage - maxLength + 1 : maxPage = minPage + maxLength - 1
    }

    return range(minPage, maxPage);
};

export function range(start, end) {
    const arr = [];
    const length = end - start;
    for (let i = 0; i <= length; i++) {
        arr[i] = start;
        start++;
    }
    return arr;
}

export const capitalize = str => (str.charAt(0).toUpperCase() + str.slice(1)).replace(/-/g, ' ');


export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

export const getRandomItem = arr => {
    return arr[getRandomInt(0, arr.length)]
};

export function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
    return array
}


export function getRandomItems(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}