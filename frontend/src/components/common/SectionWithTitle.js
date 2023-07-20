import React from 'react';
import {Col, Row} from 'reactstrap';
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons/faChevronRight";

const SectionWithTitle = ({children, title, to, button}) => {
    return (
        <div className='mb-4'>
            <div className='container mt-3'>
                <Row noGutters>
                    <Col>
                        {to
                            ? <Link className='ml-2 fs-0 text-900 font-weight-semi-bold text-decoration-none' to={to}>
                                {title}
                                <FontAwesomeIcon icon={faChevronRight} transform='shrink-2' className='text-500 ml-2'/>
                            </Link>
                            : <div className='ml-2 fs-0 text-900 font-weight-semi-bold'>
                                {title}
                            </div>
                        }
                    </Col>
                    {button && <Col className='col-auto my-auto'>
                        {button}
                    </Col>}
                </Row>
            </div>
            {children}
        </div>
    );
};

export default SectionWithTitle;