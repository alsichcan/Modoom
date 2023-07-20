import React from 'react';
import {Row, Col} from 'reactstrap';
import Avatar from "./Avatar";
import {useHistory} from 'react-router-dom';
import {appUrls} from "../../urls";
import classNames from 'classnames';

const ProfileAvatar = ({profile, className, size, style, useLink, ...rest}) => {
    const history = useHistory();
    return (
        <Avatar className={classNames({[className]: !!className, 'cursor-pointer': useLink})}
                size={size}
                onClick={() => {
                    useLink && history.push(appUrls({nickname: profile.nickname}).profile);
                }}
                mediaClass='bg-primary'
                src={profile.image}
                name={profile.first_name || '?'}
                style={style}
                {...rest}
        />

    );
};

export default React.memo(ProfileAvatar);