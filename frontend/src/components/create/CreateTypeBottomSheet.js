import React from 'react';
import {Col, Row} from 'reactstrap';
import BottomSheet from "../common/BottomSheet";
import {Link} from "react-router-dom";
import {appUrls} from "../../urls";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusCircle} from "@fortawesome/free-solid-svg-icons/faPlusCircle";
import {faBullhorn} from "@fortawesome/free-solid-svg-icons/faBullhorn";
import {faPencilAlt} from "@fortawesome/free-solid-svg-icons/faPencilAlt";
import {faUsers} from "@fortawesome/free-solid-svg-icons/faUsers";

const BottomSheetOptionLink = ({to, onClick, icon, title, description}) => {
    return (
        <Link to={to} className='text-decoration-none' onClick={onClick}>
            <Row noGutters className='my-3'>
                <Col className='col-auto my-auto mr-3'>
                    <div className='icon-item icon-item-lg bg-soft-primary text-primary'>
                        <FontAwesomeIcon icon={icon} transform='grow-8'/>
                    </div>
                </Col>
                <Col className='my-auto'>
                    <div className='fs-0 font-weight-normal text-800'>
                        {title}
                    </div>
                    <div className='text-600 fs--1'>
                        {description}
                    </div>
                </Col>
            </Row>
        </Link>
    )
};

const CreateTypeBottomSheet = (props) => {
    return (
        <BottomSheet {...props}>
            <BottomSheetOptionLink to={appUrls().createModoom} onClick={() => {
                props.setIsOpen(false);
            }} title='모둠 만들기' description='모둠을 만들어 마음 맞는 사람들과 함께하세요.' icon={faUsers}/>

            <BottomSheetOptionLink to={appUrls().createPost} onClick={() => {
                props.setIsOpen(false);
            }} title='글 쓰기' description='자유롭게 글을 써보세요.' icon={faPencilAlt}/>
        </BottomSheet>
    );
};

export default CreateTypeBottomSheet;