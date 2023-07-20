import React, {useState} from 'react';
import {Row, Col, Nav, NavItem, NavLink} from 'reactstrap';
import {tabs} from "./tabs";
import PageTab from "./PageTab";
import {Home} from "react-feather";
import {isInWebAppiOS} from "../../helpers/utils";

const PageTabContainer = (props) => {
    return (
        <div className='page-tabs-container border-top'>
            <div className='container page-tabs-wrapper' style={(isInWebAppiOS) ? {padding: '0 0 0.7rem 0'} : {}}>
                {tabs.map((tab, index) => {
                    return <PageTab
                        key={tab.url}
                        active={tab.strict ? props.location.pathname === tab.url : props.location.pathname.startsWith(tab.url)}
                        {...tab}
                    />
                })}
            </div>
        </div>
    );
};

export default PageTabContainer;