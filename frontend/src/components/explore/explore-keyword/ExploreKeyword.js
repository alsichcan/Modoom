import React, {Fragment} from 'react';
import {Badge, Col, Row} from 'reactstrap';
import urls, {appUrls} from "../../../urls";
import truncate from 'lodash/truncate'
import classNames from 'classnames';
import {useHistory} from 'react-router-dom';
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";

export const KeywordListItem = ({keyword}) => {
    const history = useHistory();
    return (
        <div className='border-radius-1 bg-white p-2 custom-shadow cursor-pointer' onClick={() => {
            history.push(appUrls({keyword: keyword.name}).exploreKeyword)
        }}>
            <Badge className='fs--1 px-1' color='soft-primary'>{truncate(keyword.name, {
                length: 15,
                omission: '..'
            })}</Badge>
            <div className='text-600 fs--2 mt-2' style={{lineHeight: 1.3}}>
                <div>
                    {keyword.n_modooms}개의 모둠
                </div>
            </div>
        </div>
    )
};

const ExploreKeyword = () => {
    const {bottomRef, data} = useInfiniteScroll(urls().keywords, {limit: 50})
    return (
        <Fragment>
            <div className='container'>
                <Row noGutters className='mb-3'>
                    {data.map((keyword, index) => {
                        return <Col className={classNames('col-6 col-md-4 px-2 mt-3')} key={keyword.id}>
                            <KeywordListItem keyword={keyword}/>
                        </Col>
                    })}
                </Row>
            </div>
            <div ref={bottomRef}/>
        </Fragment>
    );
};

export default ExploreKeyword;