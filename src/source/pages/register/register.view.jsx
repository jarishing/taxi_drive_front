import React from 'react';
import MVP from '../../utils/mvp';
import styled from 'styled-components';
import bg from '../login/bg.png';
import withModal from '../../components/modal/modal';
import SweetAlert from 'sweetalert-react';
import api from '../../api';

class View extends MVP.View{

    constructor(props){
        super(props);
        this.state ={ 
            file : null,
            alert: {
                show: false,
                title: "",
                text: "",
                type: "text",
                placeholder: "",
                onConfirm: input => {
                    console.log(input);
                }
            }, 
            loading: false
        }
    }

    componentDidUpdate(){

    }

    uploadImage = async file => {
        this.setState({ loading: true });
        const path = await api.user.upload(file);
        this.setState({ file: path }) 
        this.setState({ loading: false });
    }

    handleChange = (field, inner) => value => {
        const stateChange = JSON.parse(JSON.stringify(this.state))
        if(inner)
            stateChange[inner][field] = value;
        else
            stateChange[field] = value;
        this.setState(stateChange);
    }


    onSubmit = async () => {
        const name = this.refs.name.value;
        const telephone_no = this.refs.phone.value;
        const password = this.refs.password.value;
        const password_repeat = this.refs.password_repeat.value;
        const vehicle_reg_no = this.refs.vehicle_reg_no.value;
        const taxi_driver_id_no = this.refs.taxi_driver_id_no.value;

        if ( 
            name.trim() == "" ||
            telephone_no.trim() == "" ||
            password.trim() == "" ||
            password_repeat.trim() == "" ||
            vehicle_reg_no.trim() == "" ||
            taxi_driver_id_no.trim() == "" ||
            this.state.file == null
        ) {
            return this.alert('認證錯誤', '請填寫所有資料');
        }

        if ( password != password_repeat ) {
            return this.alert('認證錯誤', '密碼和輸入密碼不一樣');
        }

        try {
            let response = await api.user.register(
                name, password, telephone_no, 
                vehicle_reg_no, taxi_driver_id_no,
                this.state.file
            );

            if( response.error ){
                if( response.error.code == "UserExists" )
                    return this.alert('註冊失敗', `這個電話已被註冊！如遺失密碼，請用忘記密碼功能！`);
                else
                    return this.alert('註冊失敗', `資料有誤. 請檢查你的輸入! `);
            }

            this.alert('註冊成功', `成功註冊! 管理員會盡快審核你的申請! `, _ => {
                this.handleChange("show", 'alert')(false);
                this.props.history.replace('/');
            });
        } catch( error ){
            console.log(error);
            this.alert('註冊失敗', `資料有誤. 請檢查你的輸入! `);
        }
        

        // return this.alert('註冊成功', '成功註冊! 管理員會盡快審核你的申請! ');
    }

    alertClose = () => {
        const state = JSON.parse(JSON.stringify(this.state));
        state.alert.show = false;
        this.setState( state );
    }

    alert = ( title, text, onConfirm ) => {
        const state = JSON.parse(JSON.stringify(this.state));
        state.alert.title = title;
        state.alert.text = text;
        state.alert.show = true;
        state.alert.type = 'text';
        state.alert.onConfirm = onConfirm;
        this.setState( state );
    }

    prompt = ( title, text, placeholder, onConfirm ) => {
        const state = JSON.parse(JSON.stringify(this.state));
        state.alert.title = title;
        state.alert.text = text;
        state.alert.show = true;
        state.alert.type = 'input';
        state.alert.placeholder = placeholder;
        state.alert.onConfirm = onConfirm;
        this.setState( state );
    }

    render(){
        return (
            <div 
                className="login-container"
                style={{ backgroundImage: `url('https://s3-ap-southeast-1.amazonaws.com/image-bucket-ken.yip/194YYeTmdQ%E6%8B%B7%E8%B2%9D.jpg')` }}
            >

                {
                    this.state.alert.type == "text" && <SweetAlert
                        show={this.state.alert.show}
                        title={this.state.alert.title}
                        text={this.state.alert.text}
                        onConfirm={_ => {
                            this.state.alert.onConfirm? this.state.alert.onConfirm():this.handleChange("show", 'alert')(false) 
                        }} 
                    />
                }

                {
                    this.state.alert.type == "input" && <SweetAlert
                        show={this.state.alert.show}
                        title={this.state.alert.title}
                        text={this.state.alert.text}
                        type="input"
                        showCancelButton
                        onCancel={ this.alertClose }
                        inputPlaceholder={this.state.alert.placeholder}
                        onConfirm={this.state.alert.onConfirm}
                    />
                }

                <input 
                    type="file" 
                    accept="image/*;capture=camera"
                    id="picture"    
                    style={{ display: 'none' }}
                    // onClick={ event => event.target.value = null }
                    onChange={ event => 
                        this.uploadImage(event.target.files[0])
                    }
                />

                <div className="login-container__dark" />
                <div className="login-content">
                    <div className="brand">
                        <h2> 的士電召 司機版 </h2>
                    </div>
                    <p> 
                        註冊成為用戶 <span 
                                        className="green pointer" 
                                        style={{ color:'lightgreen'}}
                                        onClick={ _ => this.props.history.goBack() }
                                    >
                                        已註冊為用戶?
                                    </span> 
                    </p>
                    <form 
                        className="login-content__form" 
                        onSubmit={ event => event.preventDefault()}
                    >
                        <div className="form-group">
                            <input  
                                className="form-control" 
                                placeholder="用戶電話"
                                type="number"
                                max="8"
                                ref="phone"
                            /> 
                        </div>

                        <div className="form-group">
                            <input  
                                className="form-control" 
                                placeholder="用戶名字"
                                ref="name"
                            /> 
                        </div>

                        <div className="form-group">
                            <input  
                                className="form-control" 
                                placeholder="司機號碼"
                                ref="taxi_driver_id_no"
                            /> 
                        </div>

                        <div className="form-group">
                            <input  
                                className="form-control" 
                                placeholder="車牌號碼"
                                ref="vehicle_reg_no"
                            /> 
                        </div>

                        <div className="form-group">
                            <input 
                                type="password" 
                                className="form-control" 
                                placeholder="密碼" 
                                ref="password"
                            />
                        </div>
                        <div className="form-group">
                            <input 
                                type="password" 
                                className="form-control" 
                                placeholder="重覆密碼" 
                                ref="password_repeat"
                            />
                        </div>

                        {
                            this.state.loading && <div className="form-group">
                                <button 
                                    type="submit" 
                                    className="btn btn-default width100"
                                > 
                                    <i className="fa fa-photo" style={{ marginRight: '5px'}} disabled/> 正在上傳照片 ... 
                                </button> 
                            </div>
                        }
                        {
                            this.state.file && !this.state.loading && <div className="form-group">
                                <button 
                                    type="submit" 
                                    className="btn btn-success width100"
                                    onClick={ event => {
                                        document.getElementById('picture').click()
                                    }}
                                > 
                                    <i className="fa fa-photo" style={{ marginRight: '5px'}}/> 已上傳司機證照片
                                </button> 
                            </div> 
                        }
                        { 
                            !this.state.file && !this.state.loading && <div className="form-group">
                                <button 
                                    type="submit" 
                                    className="btn btn-default width100"
                                    onClick={ event => {
                                        document.getElementById('picture').click()
                                    }}
                                > 
                                    <i className="fa fa-photo" style={{ marginRight: '5px'}}/> 上傳司機證照片
                                </button> 
                            </div>
                        }

                        <button 
                            type="submit" 
                            className="btn btn-warning width100"
                            onClick={ event => {
                                event.preventDefault();
                                this.onSubmit();
                            }}
                        > 
                            註冊成為新用戶
                        </button> 
                    </form>
                    <footer style={{ paddingBottom:'10px'}}>
                        @ 2018. 的士電召. All RIGHT RESERVED.
                    </footer>
                </div>
            </div>
        )
    }

}

export default (View);