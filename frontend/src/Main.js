import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import AppContext, {AuthContext} from './context/Context';
import toggleStylesheet from './helpers/toggleStylesheet';
import {
    detectIE,
    getItemFromStore,
    isDev,
    isInWebAppChrome,
    isInWebAppiOS, isMobile,
    setItemToStore,
    themeColors
} from './helpers/utils';
import {useLocation, useHistory} from 'react-router-dom';
import {ga} from "./index";
import {useGA4React} from "ga-4-react";

export const defaultAppBarState = {
    title: '',
    useLogo: false,
    useBackButton: false,
    useCollapse: false,
    useNotification: true,
    borderBottom: true,
    useInfo: false,
    infoUrl: '',
    infoCount: 0,
    useSearch: false,
    hidden: false
}

export const defaultModalState = {
    isOpen: false,
    title: '',
    content: '',
    dismissText: '취소',
    confirmText: '확인',
    onDismiss: null,
    onConfirm: null,
    oneButton: false
}

const Main = props => {
    detectIE();
    const {authState} = useContext(AuthContext);
    const location = useLocation();
    const [isDark, setIsDark] = useState(getItemFromStore('isDark', false));
    const [isLoaded, setIsLoaded] = useState(false);

    const [isCreateBottomSheetOpen, setIsCreateBottomSheetOpen] = useState(false);
    const [showAddToHomeScreen, setShowAddToHomeScreen] = useState(false);
    const toggleBottomSheet = () => {
        setIsCreateBottomSheetOpen(!isCreateBottomSheetOpen);
    };

    const [appBarState, setAppBarState] = useState(defaultAppBarState);
    const [modalState, setModalState] = useState(defaultModalState);

    useEffect(() => {
        if (isMobile() && !(isInWebAppiOS || isInWebAppChrome) && getItemFromStore('modoomDismissedPWA', false) === false) {
            setShowAddToHomeScreen(true);
        }
    }, []);

    const value = {
        isDark,
        setIsDark,
        isCreateBottomSheetOpen,
        setIsCreateBottomSheetOpen,
        toggleBottomSheet,
        appBarState,
        setAppBarState,
        modalState,
        setModalState,
        showAddToHomeScreen,
        setShowAddToHomeScreen
    };

    const ga = useGA4React();
    useEffect(() => {
        if (ga) {
            ga.pageview(location.pathname);
        }
    }, [ga, location])

    const setStylesheetMode = mode => {
        setIsLoaded(false);
        setItemToStore(mode, value[mode]);
        toggleStylesheet({isDark}, () => setIsLoaded(true));
    };

    useEffect(() => {
        setStylesheetMode('isDark');
        // eslint-disable-next-line
    }, [isDark]);

    if (!isLoaded) {
        toggleStylesheet({isDark}, () => setIsLoaded(true));
        return (
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    backgroundColor: isDark ? themeColors.dark : themeColors.light
                }}
            />
        );
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

Main.propTypes = {children: PropTypes.node};

export default Main;
