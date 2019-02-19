import { combineReducers } from 'redux';
import base from './base/base.reducer';
import * as baseAction from './base/base.action';

const reducers = combineReducers({ 
    base: base
});

export const action = {
    base: baseAction,
};

export default reducers;