import React, {useContext} from 'react';
import {Col, Row} from 'reactstrap';
import {Users} from "react-feather";
import {useHistory} from 'react-router-dom';
import classNames from 'classnames'
import {appUrls} from "../../../urls";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons/faCircleNotch";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import AppContext from "../../../context/Context";
import {defaultModalState} from "../../../Main";
import ReelProfileGroup from "./ReelProfileGroup";
import {UnreadBadge} from "../../feeds/ModoomVerticalListItem";

const Reel = ({modoom, isFirst, isLast, isPending, unreadCount}) => {
    const {modalState, setModalState} = useContext(AppContext);
    const history = useHistory();

    const onClick = () => {
        if (isPending) {
            setModalState({...defaultModalState, title: '승인 대기 중입니다.', content: '모둠장님이 가입을 승인할 때까지 조금만 기다려주세요!', isOpen: true, oneButton: true})
        } else {
            history.push(appUrls({modoomId: modoom.id}).chatsModoom)
        }
    };

    return (
        <div onClick={onClick}
             className={classNames('bg-white border-radius-1 p-2 custom-shadow mx-sm-0 mb-2 cursor-pointer', {
                 'mr-2': isLast,
             })}>
            <div
                className='fs--1 font-weight-semi-bold text-900 mb-1 text-overflow-ellipsis mb-2'
                style={{height: '2.5rem'}}>
                <UnreadBadge className='mr-1' unreadCount={unreadCount}/>
                {modoom.title}
            </div>
            {isPending
                ? <div className='fs--1 text-primary font-weight-semi-bold d-flex align-items-center pt-3' style={{height: '2.5rem'}}>
                    <FontAwesomeIcon icon={faCircleNotch} className='fa-spin mr-1 align-middle' transform='shrink-2'/>
                    승인 대기 중
                </div>
                : <Row noGutters style={{height: '2.5rem'}}>
                    <Col>
                        <ReelProfileGroup modoom={modoom} limit={2} size={'2.5rem'}/>
                    </Col>
                    <Col className='col-auto d-flex justify-content-end'>
                        <div className='fs--1 d-flex align-items-center mt-2'>
                            <Users size={15} className='mr-1'/>
                            {modoom.n_members}
                        </div>
                    </Col>
                </Row>
            }
        </div>
    );
};

export default Reel;