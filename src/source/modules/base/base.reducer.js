import createReducer from 'ken.yip/react/createReducer';

const initState = {
    user : null,
    accessToken : null
};

const actionHandlers = {
    SET_USER: ( state, action ) => {
        let result = { ... state };
        result.user = action.payload.user;
        result.accessToken = action.payload.accessToken;
        return result;
    }
};

export default createReducer(initState, actionHandlers);