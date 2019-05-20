import React from 'react'
import { Switch, Route } from 'react-router-dom';
import App from './App';
import Pages from './pages';


class Router extends React.Component{
    render(){
        return(
            <App>
                <Switch>
                    <Route exact path='/' component={Pages.login}/>
                    <Route exact path='/forget' component={Pages.forget}/>
                    <Route exact path='/changePw' component={Pages.changePw}/>
                    <Route exact path='/register' component={Pages.register}/>
                    <Route exact path='/main' component={Pages.main}/>
                    <Route exact path='/order/:orderId' component={Pages.order}/>
                </Switch>
            </App>
        )
    }
};

export default Router;