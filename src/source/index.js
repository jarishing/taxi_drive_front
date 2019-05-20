import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import Store from './store';
import Router from './router';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';

import 'ken.yip/css/bootstrap.css';
import 'ken.yip/css/inline-class.css';
import './css';

require('babel-core/register');
require('babel-polyfill');

const startApp = () => {

    if(window.MobileAccessibility){
        window.MobileAccessibility.usePreferredTextZoom(false);
    } else 
        window.alert('MobileAccessibility not exist')

    ReactDOM.render(
        <Provider store={Store}>
            <CookiesProvider>
                <HashRouter>
                    <Router />
                </HashRouter>
            </CookiesProvider>
        </Provider>
    , document.getElementById('root'));
    // registerServiceWorker();
  };
  

    if(window.cordova){
        document.addEventListener('deviceready', startApp, false);
    } else {
        startApp();
    }

