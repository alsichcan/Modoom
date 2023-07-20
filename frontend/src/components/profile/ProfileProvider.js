import React, {useEffect, useState} from 'react';
import {ProfileContext} from "../../context/Context";
import axios from "axios";
import {axiosGet} from "../../actions/axios";
import urls from "../../urls";
import {useHistory} from 'react-router-dom';
import {checkRedirect404} from "../../helpers/utils";

const ProfileProvider = ({nickname, children}) => {
    const [profile, setProfile] = useState({});
    const [modooms, setModooms] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toggleRefresh, setToggle] = useState(false);
    const history = useHistory();

    const refresh = () => {
        setToggle(!toggleRefresh);
    };

    useEffect(() => {
        const source = axios.CancelToken.source();
        axiosGet(source, urls({nickname}).profileDetail).then(data => {
            checkRedirect404(data, history, () => {
                setProfile(data);
            });
        });
        axiosGet(source, urls({nickname}).modooms, {limit: 100, query: 'profile'}).then(data => {
            data && setModooms(data?.results);
            setLoading(false);
        });
        // axiosGet(source, urls({nickname}).posts, {limit: 3}).then(data => {
        //     data && setPosts(data?.results);
        // });
        return () => {
            source.cancel();
        };
    }, [nickname, toggleRefresh]);

    const value = {nickname, profile, setProfile, modooms, posts, refresh, loading};
    return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export default ProfileProvider;