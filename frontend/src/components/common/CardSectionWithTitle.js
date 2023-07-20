import React, {Fragment} from 'react';
import {Row, Col} from 'reactstrap';
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons/faChevronRight";
import ModoomVerticalListItem from "../feeds/ModoomVerticalListItem";
import CardSection from "./CardSection";
import {Frown} from "react-feather";
import {faFrown} from "@fortawesome/free-regular-svg-icons/faFrown";
import classNames from 'classnames';
import Section from "./Section";

const CardSectionWithTitle = ({to, title, children, className, ...rest}) => {
    return (
        <CardSection className={classNames({[className]: !!className})} {...rest}>
            <div className='mb-3'>
                {to
                    ? <Link className='fs-1 text-900 font-weight-semi-bold text-decoration-none' to={to}>
                        {title}
                        <FontAwesomeIcon icon={faChevronRight} transform='shrink-2' className='text-500 ml-2'/>
                    </Link>
                    : <div className='fs-1 text-900 font-weight-semi-bold'>
                        {title}
                    </div>}
            </div>
            {children}
        </CardSection>
    );
};

CardSectionWithTitle.defaultProps = {
    className: 'mb-4'
};

export default CardSectionWithTitle;