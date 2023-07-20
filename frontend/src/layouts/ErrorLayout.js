import React from 'react';
import PropTypes from 'prop-types';
import {Redirect, Route, Switch} from 'react-router-dom';
import {Col, Row} from 'reactstrap';
import Error404 from '../components/errors/Error404';
import Error500 from '../components/errors/Error500';
// import Logo from '../components/navbar/Logo';
import Section from '../components/common/Section';

const ErrorLayout = ({match: {url}, location}) => {
    return (
        <Section className="py-0">
            <Row className="flex-center min-vh-100 py-6">
                <Col className="col-11 col-lg-7">
                    <Switch>
                        <Route path={`${url}/404`} component={Error404}/>
                        <Route path={`${url}/500`} component={Error500}/>

                        {/*Redirect*/}
                        <Redirect to={`${url}/404`}/>
                    </Switch>
                </Col>
            </Row>
        </Section>
    )
};

ErrorLayout.propTypes = {match: PropTypes.object};

export default ErrorLayout;
