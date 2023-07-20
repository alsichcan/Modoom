import React, {useContext} from 'react';
import CommonAppBar from "./CommonAppBar";
import AppContext from "../../context/Context";
import classNames from 'classnames'

const AppBarContainer = () => {
    const {appBarState} = useContext(AppContext);
    if (appBarState.hidden) {
        return null;
    }
    return (
        <div className={classNames('appbar-container', {
            'border-bottom': appBarState.borderBottom
        })}>
            <CommonAppBar/>
        </div>
    );
};

export default AppBarContainer;