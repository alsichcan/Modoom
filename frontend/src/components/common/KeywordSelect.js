import React, {Fragment, useEffect, useState} from 'react';
import {Row, Col} from 'reactstrap';
import AsyncCreatableSelect from 'react-select/async-creatable';
import {components} from 'react-select';
import {colourOptions} from "../create/CreateModoom";
import {axiosGet} from "../../actions/axios";
import urls from "../../urls";
import debounce from 'lodash/debounce'
import {AlertCircle} from "react-feather";

const loadOptions = (inputValue, callback) => {
    axiosGet(null, urls().keywords, {startswith: inputValue, limit: 5}).then(data => {
        callback(data.results);
    });
};

const debouncedLoadOptions = debounce(loadOptions, 500);

const MultiValue = props => {
    return <components.MultiValue {...props}>{props.data.name}</components.MultiValue>
};

const KeywordSelect = ({setKeywords, defaultValue, placeholder, errorMsg}) => {
    console.log(defaultValue);
    useEffect(() => {
        // 키워드 증발하는 문제 수정
        setKeywords(defaultValue?.map(keyword => keyword.name));
    }, []);
    return (
        <Fragment>
            <AsyncCreatableSelect
                isMulti
                placeholder={placeholder || '키워드를 입력해주세요.'}
                name="keywords"
                loadOptions={debouncedLoadOptions}
                onChange={keywords => setKeywords(keywords.map(keyword => keyword.name))}
                onInputChange={(inputValue) => inputValue.trim()}
                getNewOptionData={(inputValue) => {
                    return {name: inputValue}
                }}
                isValidNewOption={(inputValue, selectValue, selectOptions) => {
                    return inputValue !== '' && !!!selectOptions.some(option => option.name === inputValue);
                }}
                getOptionValue={option => {
                    return option.name
                }}
                defaultValue={defaultValue}
                getOptionLabel={option => option.name}
                formatOptionLabel={option => {
                    return <div>
                        {option.name}
                        <span className='ml-2 fs--2 react-select__option-detail'>
                        {option.n_modooms === undefined ? '생성하기' : `${option.n_modooms}개의 모둠`}
                    </span>
                    </div>
                }}
                components={{MultiValue}}
                classNamePrefix='react-select'
                defaultOptions
            />
            {errorMsg && <div className='fs--2 text-danger'>
                <AlertCircle size={15} className='mr-1'/>
                {errorMsg}
            </div>}
        </Fragment>
    );
};

export default KeywordSelect;