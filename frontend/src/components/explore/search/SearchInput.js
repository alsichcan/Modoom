import React from 'react';
import {Row, Col} from 'reactstrap';
import WizardInput from "../../common/wizard-input/WizardInput";

const SearchInput = ({onSearch, value, setValue}) => {
    return (
        <WizardInput
            type='text'
            className='bg-200 px-2 border-radius-1'
            placeholder='검색어를 입력하세요.'
            name='search'
            value={value}
            onChange={(e) => {
                setValue(e.target.value);
            }}
            onKeyPress={e => {
                e.key === 'Enter' && onSearch();
            }}
        />
    );
};

export default SearchInput;