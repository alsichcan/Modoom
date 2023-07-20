import React, {useContext} from 'react';
import {Row, Col} from 'reactstrap';
import InteractionButton from "../common/InteractionButton";
import {appUrls} from "../../urls";
import {axiosPost} from "../../actions/axios";
import {AuthContext} from "../../context/Context";
import {logout} from "../../actions/auth";
import {useHistory} from 'react-router-dom';
import {toast} from "react-toastify";

const MyProfileButtons = ({nickname}) => {
    const {authDispatch} = useContext(AuthContext);
    const history = useHistory();

    const onLogout = () => {
        logout(null, authDispatch).then(() => {
            history.push(appUrls().login);
        });

    };

    return (
        <Row noGutters>
            <Col className='pr-3'>
                <InteractionButton text='프로필 편집' className='py-1' icon='Settings'
                                   to={appUrls({nickname}).profileEdit}/>
            </Col>
            <Col>
                <InteractionButton text='로그아웃' className='py-1' icon='LogOut' onClick={onLogout}/>
            </Col>
        </Row>
    )
};

export default MyProfileButtons;