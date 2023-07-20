import React from 'react';
import Layout from './layouts/Layout';
import PreLanding from "./components/pre-landing/PreLanding";


// export const bro = createBrowserHistory();
// history.listen((location, action) => {
//     ga4react.pageview(location.pathname + location.search);
//     console.log(location.pathname + location.search)
// });

function App() {
    return (
        <Layout/>
        // <PreLanding/>
    );
}

export default App;
