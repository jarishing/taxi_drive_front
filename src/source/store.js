import { createStore, applyMiddleware } from 'redux';
import Reducers from './modules';
import thunk from 'redux-thunk';
// import logger from 'redux-logger';

let Store = createStore(Reducers, applyMiddleware(thunk, ));

export default Store;