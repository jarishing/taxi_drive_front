import axios from 'axios';
import url from './url';
import Store from '../store';

export async function getAnOrder( orderId ){

    const access_token = Store.getState().base.accessToken;

    let { data: info } = await axios.get(
        url + '/api/order/' + orderId, 
        { 
            headers: { authorization: 'Bearer ' + access_token }
        }
    );

    return info.data;
}

export async function getOrder(type = 'new'){

    const access_token = Store.getState().base.accessToken;

    let { data: info } = await axios.get(
        url + '/api/order', 
        { 
            params: { status: type },
            headers: { authorization: 'Bearer ' + access_token }
        }
    );
    return info.data;
}

export async function makeOrder(origin, mid, destination, criteria){
    
    const access_token = Store.getState().base.accessToken;

    const { data: info } = await axios.post(
        url + '/api/order', 
        { 
            origin, destination, 
            criteria, 
            route: mid.trim() != ''? mid.trim(): undefined
        },
        { 
            headers: { 
                authorization: 'Bearer ' + access_token 
            }
        }
    );
    return info.data;
}

export async function cancelOrder(orderId){
    
    const access_token = Store.getState().base.accessToken;

    const { data: info } = await axios.post(
        url + '/api/order/' + orderId, 
        { 
            type: 'cancel'
        },
        { 
            headers: { 
                authorization: 'Bearer ' + access_token 
            }
        }
    );

    return info.data;
}



export async function releaseOrder(orderId){
    
    const access_token = Store.getState().base.accessToken;

    const { data: info } = await axios.post(
        url + '/api/order/' + orderId, 
        { 
            type: 'release'
        },
        { 
            headers: { 
                authorization: 'Bearer ' + access_token 
            }
        }
    );

    return info.data;
}


export async function confirmOrder(orderId){
    
    const access_token = Store.getState().base.accessToken;

    const { data: info } = await axios.post(
        url + '/api/order/' + orderId, 
        { 
            type: 'confirm'
        },
        { 
            headers: { 
                authorization: 'Bearer ' + access_token 
            }
        }
    );

    return info.data;
}

export async function getOrdererOrder(){

    const access_token = Store.getState().base.accessToken;

    const { data: info } = await axios.get(
        url + '/api/order', 
        { 
            params: {
                status: 'all', identity: 'orderer'
            },
            headers: { 
                authorization: 'Bearer ' + access_token 
            }
        }
    );
    
    return info.data;

}

export async function acceptOrder(orderId){

    const access_token = Store.getState().base.accessToken;

    const response = await axios.post( 
        url + '/api/order/' + orderId, 
        { 
            type: 'accept'
        },
        { 
            headers: { Authorization: 'Bearer ' + access_token }
        }
    );

    return response.data;

}

export async function overtimeOrder( orderId ){

    const access_token = Store.getState().base.accessToken;

    const response = await axios.post( 
        url + '/api/order/' + orderId, 
        { 
            type: 'overtime'
        },
        { 
            headers: { Authorization: 'Bearer ' + access_token }
        }
    );

    return response.data;

}