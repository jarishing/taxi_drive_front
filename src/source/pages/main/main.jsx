import React from 'react';
import MVP from '../../utils/mvp';

class Presenter extends MVP.Presenter {

    logout(){
        this.model.clearCookieAndGoBack();
    }

    renewOrder(){
        this.model.getOrder();
    }

    renewMe(){
        this.model.getMe();
    }

    confirmOvertime( orderId ){
        this.view.confirmOvertime(orderId);
    }


}

export default Presenter;

