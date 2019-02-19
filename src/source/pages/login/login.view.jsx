import React from 'react';
import bg from './bg.png';
import './login.css';
import SweetAlert from 'sweetalert-react';

export default props => {
    return (
        <div 
            className="login-container"
            style={{ backgroundImage: `url('https://s3-ap-southeast-1.amazonaws.com/image-bucket-ken.yip/194YYeTmdQ%E6%8B%B7%E8%B2%9D.jpg')` }}
        >

            {
                props.alert.type == "text" && <SweetAlert
                    show={props.alert.show}
                    title={props.alert.title}
                    text={props.alert.text}
                    onConfirm={_ =>props.handleChange("show", 'alert')(false)}
                />
            }

            <div className="login-container__dark" />
            <div className="login-content">
                <div className="brand">
                    <h2> 的士電召 司機版 </h2>
                </div>
                <p> 登入你的用戶 </p>
                <form className="login-content__form">
                    <div className="form-group">
                        <input  
                            className="form-control" 
                            placeholder="用戶電話"
                            value={props.phone}
                            type="number"
                            onChange={event => props.onFieldChange('phone', event.target.value)}
                        /> 
                    </div>
                    <div className="form-group">
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="密碼" 
                            value={props.password}
                            onChange={event => props.onFieldChange('password', event.target.value)}   
                        />
                    </div>
                    <div className="form-group clearfix">
                        {/* <div className="float-left">
                            <input 
                                type="checkbox" 
                                className="margin-right-8"   
                                onChange={ _ => props.onFieldChange('remainder', !props.remainder )} 
                                checked={props.remainder}
                            />
                            Remember me 
                        </div> */}
                        <p 
                            className="float-right pointer"
                            onClick={ _ => props.history.push('/register')}
                        > 
                            註冊為新用戶 
                        </p>
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-success width100"
                        onClick={ event => {
                            event.preventDefault();
                            props.submit();
                        }}
                    > 
                        登入
                    </button> 
                </form>
                <footer>
                    @ 2018. 的士電召. All RIGHT RESERVED.
                </footer>
            </div>
        </div>
    )
}