import axios from 'axios';
import url from './url';
import Socket from '../socket';
import Store from '../store';

export async function login( telephone_no, password){
    let { data: info } = await axios.post(url + '/api/user/login', {telephone_no, password, type: 'driver'});
    await Socket.whatIsMe(info.access_token);
    return { access_token: info.access_token, user: info.user };
}

export async function getMe( userId, access_token){
    try {
        let { data: info } = await axios.get(
            url + '/api/user/' + userId, 
            { headers: { authorization: 'Bearer ' + access_token}
        });
        await Socket.whatIsMe(access_token);
        return info.data;
    } catch( error ){
        return null;
    }
}

export async function forgetPassword( body ){
    let data = await axios.post(
        url + '/api/user/forgetPassword',
        body
    )
    .catch( error => {
        console.log(error);
        window.alert('您的用戶名稱或電話號碼錯誤，請重新確認');
        return null;
    });

    return data;  
}

export async function changePw( body , userId, access_token ){

    console.log( body , userId, access_token );
    let data = await axios.patch(
        url + '/api/user/' +  userId, 
        body,
        {headers: { authorization: 'Bearer ' + access_token }}
    ).catch( error => {
        console.log(error);
        window.alert('您的密碼並不正確，請重新輸入');
        return null;
    });
    
    return data;    
    // .catch( error => {
    //     console.log(error);
    //     window.alert('您的用戶名稱或電話號碼錯誤，請重新確認');
    //     return null;
    // });

    // return data;  
}

export async function register( 
    username, 
    password, 
    telephone_no, 
    vehicle_reg_no, 
    taxi_driver_id_no,
    file
){
    const type = 'driver';

    const response = await axios.post( url+'/api/user', 
        { 
            type, username, telephone_no, password, 
            vehicle_reg_no, taxi_driver_id_no, taxi_driver_id_photo: file 
        }
    )
    .catch( error => {
        return error.response.data
    });

    if( response.error )
        return response;

    const { access_token, user } = response.data;

    return { access_token, user };
}

export async function upload(file){
    const data = new FormData();
    data.append('image', file );
    const response = await axios.post( url + '/api/upload', data );
    return response.data.data.filename;
}

export async function updateVehicleRegNo( vehicle_reg_no ){
    
    const access_token = Store.getState().base.accessToken;

    let { data: info } = await axios.patch(
        url + '/api/user/' +  Store.getState().base.user._id, 
        { vehicle_reg_no }, 
        { 
            headers: { authorization: 'Bearer ' + access_token }
        }
    );
    return info.data;    

}