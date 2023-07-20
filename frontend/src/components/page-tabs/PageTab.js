import React, {useContext, Fragment} from 'react';
import * as Icon from 'react-feather';
import {grays, themeColors} from "../../helpers/utils";
import {Link} from "react-router-dom";
import AppContext, {AuthContext, MainContext, NotificationContext} from "../../context/Context";
import urls, {appUrls} from "../../urls";

const PageTab = ({name, icon, url, active, asPopUp}) => {
    const {isCreateBottomSheetOpen, setIsCreateBottomSheetOpen} = useContext(AppContext);
    const {notiData} = useContext(NotificationContext);
    const {refreshFeeds} = useContext(MainContext);
    const {authState} = useContext(AuthContext);
    const IconTag = Icon[icon];
    const commonDiv = <div className=''>
        <IconTag size={24} color={active ? themeColors.primary : grays["600"]}/>
    </div>

    const showIndicator = name === '채팅' && notiData.n_unread_messages > 0;

    const onClickHome = () => {
        if (name === '홈') {
            refreshFeeds();
            window.scrollTo({ top: 0 })
        }
    };

    return (
        !asPopUp
            ? <div className='position-relative page-tab'>
                <Link className='d-block pb-1' onClick={onClickHome}
                      to={name === '프로필' ? appUrls({nickname: authState.user.nickname}).profile : url}>
                    {commonDiv}
                </Link>
                {showIndicator && <div className="notification-indicator-number page-tab-indicator font-weight-extra-bold">
                    {notiData.n_unread_messages}
                </div>}
            </div>
            : <div className='page-tab pb-1 cursor-pointer' onClick={() => {
                setIsCreateBottomSheetOpen(true)
            }}>
                {commonDiv}
            </div>
    );
};

export default PageTab;