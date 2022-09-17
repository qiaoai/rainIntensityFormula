import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import Formula from '../src/pages/Formula';
import TargetArea from '../src/pages/TargetArea'
import Detail from '../detail';


const BasicRoute = () => (
    <HashRouter>
        <Switch>
            <Route exact path="/formula" component={Formula}/>
            <Route exact path="/targetArea" component={TargetArea}/>
        </Switch>
    </HashRouter>
);


export default BasicRoute;