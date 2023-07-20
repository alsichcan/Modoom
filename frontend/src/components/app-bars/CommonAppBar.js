import React, {useContext} from 'react';
import {Bell, ChevronDown, ChevronUp, Info, Search, Share2} from "react-feather";
import AppContext, {MainContext, NotificationContext} from "../../context/Context";
import logo_full from '../../assets/img/logos/logo_full.svg'
import classNames from 'classnames';
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useHistory} from 'react-router-dom';
import {appUrls} from "../../urls";
import {faCircle} from "@fortawesome/free-solid-svg-icons/faCircle";
import truncate from 'lodash/truncate'

const CommonAppBar = ({children, showNotification, showShare, showMore}) => {
    const {appBarState, setAppBarState} = useContext(AppContext);
    const {refreshFeeds} = useContext(MainContext);
    const {notiData} = useContext(NotificationContext);
    const history = useHistory();

    return (
        <div className='container appbar justify-content-between user-select-none'>
            <div onClick={() => {
                appBarState.useBackButton && window.history.back()
            }} className={classNames('d-flex align-items-center font-weight-bold text-900', {
                'fs-3 font-weight-bold': !appBarState.useBackButton,
                'fs-1 cursor-pointer': appBarState.useBackButton
            })}>
                {appBarState.useBackButton && <FontAwesomeIcon icon={faChevronLeft} transform='' className='mr-1'/>}
                {appBarState.useLogo
                    ? <img className='cursor-pointer' src={logo_full} style={{height: '1.75rem'}} alt={'logo'}
                           onClick={() => {
                               refreshFeeds();
                               window.scrollTo({top: 0, behavior: 'smooth'})
                           }}/>
                    : <div className='text-overflow-ellipsis-1'>{appBarState.title}</div>}
            </div>
            <div className='d-flex cursor-pointer position-relative'>
                {showShare && <Share2 className='text-900 pt-1 mr-2' size={30}/>}

                {appBarState.useSearch && <div className='pr-2' onClick={() => {
                    history.push(appUrls().exploreSearch)
                }}>
                    <Search className='text-900 pt-1' size={30}/>
                </div>}

                {appBarState.useNotification && <div onClick={() => {
                    history.push(appUrls().notifications);
                }}>
                    <Bell className='text-900 pt-1' size={30}/>

                    {notiData.n_notifications >= 1 &&
                    <div className="notification-indicator-number font-weight-extra-bold">
                        {notiData.n_notifications}
                    </div>}
                </div>}

                {appBarState.useInfo && <div onClick={() => {
                    history.push(appBarState.infoUrl);
                }}>
                    <Info className='text-900 pt-1' size={30}/>

                    {appBarState.infoCount >= 1 &&
                    <div className="notification-indicator-number font-weight-extra-bold">
                        {appBarState.infoCount}
                    </div>}
                </div>}
            </div>
        </div>
    );
};

export default CommonAppBar;