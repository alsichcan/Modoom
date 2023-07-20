import React from 'react';
import {Row, Col, Badge} from 'reactstrap';
import {useHistory} from 'react-router-dom';
import classNames from 'classnames';
import {appUrls} from "../../urls";
import truncate from "lodash/truncate";

const KeywordBadge = ({keyword, useLink}) => {
    const history = useHistory();
    return (
        // <div className={classNames('d-inline-block', {
        //     'cursor-pointer': useLink
        // })}>
        <Badge color='soft-primary'
               onClick={() => useLink && history.push(appUrls({keyword: keyword.name}).exploreKeyword)}
               className={classNames("mr-2 mb-1 bg-200 user-select-none", {
                   'cursor-pointer': useLink
               })}>
            {truncate(keyword.name, {
                length: 10,
                omission: '..'
            })}
        </Badge>
        // </div>
    );
};

export default KeywordBadge;