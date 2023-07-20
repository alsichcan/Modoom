import React from 'react';
import {Row, Col} from 'reactstrap';
import {Link} from "react-router-dom";
import classNames from 'classnames';
import logo_full from '../../assets/img/logos/logo_full.svg'

const Logo = ({width,className, ...rest}) => {
    return (
        <Link
            to="/"
            className={classNames(
                'text-decoration-none',
            )}
            {...rest}
        >
            <div
                className={classNames(
                    'd-flex flex-center',
                    className
                )}
            >
                <img className="h-100" src={logo_full} alt="modoom"
                     width={width}/>
            </div>
        </Link>
    );
};

export default Logo;