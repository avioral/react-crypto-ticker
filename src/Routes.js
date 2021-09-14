import React from 'react';
import {Route, Switch, BrowserRouter as Router, Redirect} from 'react-router-dom';
import {AnimatePresence , motion} from 'framer-motion';

import HomePage  from "./pages/home/index" ;
import Currency from "./pages/currency/index";


const Routes = () => {

    return (
        <Router>
            <AnimatePresence exitBeforeEnter>
                <Switch>
                    <Route exact key="home" path="/">
                        <HomePage/>
                    </Route>

                    <Route exact key="currency" path="/currencies/:currency">
                        <Currency/>
                    </Route>

                    <motion.div exit='undefined'>
                        <Redirect to='/' />
                    </motion.div>
                </Switch>
            </AnimatePresence>
        </Router>
    );
};

export default Routes;
