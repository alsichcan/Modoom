import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Main from "./Main";
import {isDev} from "./helpers/utils";
import AuthProvider from "./components/auth/AuthProvider";
import 'moment/locale/ko';
import MainContextProvider from "./context/MainContextProvider";
import {BrowserRouter as Router} from "react-router-dom";
import * as Sentry from "@sentry/react";
import {Integrations} from "@sentry/tracing";
import {GA4React} from "ga-4-react";
import SearchProvider from "./components/explore/search/SearchProvider";

if (!isDev()) {
    Sentry.init({
        dsn: "https://80cc2be1e4f341448fd45835c6b5281a@o537965.ingest.sentry.io/5655882",
        integrations: [new Integrations.BrowserTracing()],

        // We recommend adjusting this value in production, or using tracesSampler
        // for finer control
        tracesSampleRate: 0.1,
    });
}

const ga4react = new GA4React('G-KSS4PB2YTR');

(async () => {
    await ga4react.initialize();

    ReactDOM.render(
        <Router basename={process.env.PUBLIC_URL}>
            <AuthProvider>
                <Main>
                    <MainContextProvider>
                        <SearchProvider>
                            <App/>
                        </SearchProvider>
                    </MainContextProvider>
                </Main>
            </AuthProvider>
        </Router>,
        document.getElementById('main')
    );
})();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// if (isDev()) {
// reportWebVitals(console.log);
// }
