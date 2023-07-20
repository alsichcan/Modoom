import React from 'react';
import PropTypes from 'prop-types';
import placeholder from '../../assets/img/logos/placeholder.svg';

const Avatar = ({size, rounded, src, name, emoji, className, mediaClass, isExact, style, onClick}) => {
    const classNames = ['avatar', `avatar-${size}`, className].join(' ');
    const mediaClasses = [rounded ? `rounded-${rounded}` : 'rounded', mediaClass, 'user-select-none'].join(' ');

    const getAvatar = () => {
        if (src) {
            return <img className={mediaClasses} src={src} alt=""/>;
        }

        if (name) {
            return (
                <div className={`avatar-name ${mediaClasses}`}>
                    <span style={{whiteSpace: 'nowrap'}}>{isExact ? name : name.slice(0, 2)}</span>
                </div>
            );
        }

        return <img className={mediaClasses} src={placeholder} alt=""/>;
    };

    return <div className={classNames} onClick={onClick} style={style}>{getAvatar()}</div>;
};

Avatar.propTypes = {
    size: PropTypes.oneOf(['s', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl']),
    rounded: PropTypes.string,
    src: PropTypes.string,
    name: PropTypes.string,
    emoji: PropTypes.string,
    className: PropTypes.string,
    mediaClass: PropTypes.string,
    isExact: PropTypes.bool
};

Avatar.defaultProps = {
    size: 'xl',
    rounded: 'circle',
    emoji: '😊',
    isExact: false
};

export default Avatar;
