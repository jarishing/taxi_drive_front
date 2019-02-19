export const setUser = ( user, accessToken ) => ({
    type: 'SET_USER',
    payload: { user, accessToken }
});