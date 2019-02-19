import React from 'react';
import MVP from '../../utils/mvp';
import './main.css';
import withModal from '../../components/modal/modal';
import SweetAlert from 'sweetalert-react';
import api from '../../api';
import moment from 'moment';

const BrowserSpeechRecognition = typeof window !== 'undefined' &&
                                            (window.SpeechRecognition ||
                                                window.webkitSpeechRecognition ||
                                                window.mozSpeechRecognition ||
                                                window.msSpeechRecognition ||
                                                window.oSpeechRecognition);

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

let isLoad = false;

class View extends MVP.View {

    constructor(props){
        super(props);
        this.state = { 
            tab : 'orders',
            release : {
                tunnel: 'any',
                taxiType: 'red',
                passenger: 4,
                payment: 'cash',
                discount: 100,
                start: '',
                mid: '',
                end: ''
            },
            touch: false,
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
            modal: null
        };
    }



    confirmOvertime = orderId => {
        confirmAlert({
            title: '時間已過',
            message: '你的訂單已經有一分鍾沒有任何人接單, 會在一分鍾後自動取消, 請問你要繼續嗎?',
            buttons: [
                {
                    label: '繼續',
                    onClick: () => api.order.overtimeOrder(orderId)
                },
                {
                    label: '不繼續',
                    onClick: () => api.order.cancelOrder(orderId)
                }
            ]
        });
    }

    alertClose = () => {
        const state = JSON.parse(JSON.stringify(this.state));
        state.alert.show = false;
        this.setState( state );
    }

    alert = ( title, text ) => {
        const state = JSON.parse(JSON.stringify(this.state));
        state.alert.title = title;
        state.alert.text = text;
        state.alert.show = true;
        state.alert.type = 'text';
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

    recognition = null;

    renderModal = props => {

        if ( this.state.modal == null )
            return <React.Fragment />;

        if ( this.state.modal.type == "previewOrder"){

            const order = this.state.modal.order;

            return (
                <React.Fragment>
                    <div className="modal-body">
                        <table className="table table-cs">
                            <tbody>
                                <tr>
                                    <td> 起點 </td>
                                    <td> { order.start.address } </td>
                                </tr>
                                {
                                    order.route && <tr>
                                        <td> 中途站 </td>
                                        <td> { order.route.address } </td>
                                    </tr>
                                }
                                <tr>
                                    <td> 終點 </td>
                                    <td> { order.end.address } </td>
                                </tr>
                                <tr>
                                    <td> 的士類型 </td>
                                    <td> { order.criteria.taxiType == 'green'? '綠的': order.criteria.taxiType == 'red'? '紅的': '籃的' } </td>
                                </tr>
                                <tr>
                                    <td> 折扣 </td>
                                    <td> { order.criteria.discount == 100? '千足金': order.criteria.discount == 90? '九折': '八五折' } </td>
                                </tr>
                                <tr>
                                    <td> 乘客人數 </td>
                                    <td> { order.criteria.passenger == 4? '四人': order.criteria.passenger == 5? '五人': order.criteria.passenger == 6? '珍寶': order.criteria.passenger == 7? '傷殘': "" } 的士 </td>
                                </tr>
                                <tr>
                                    <td> 隧道 </td>
                                    <td> { order.criteria.tunnel == 'HungHomTunnel'? '紅隧': order.criteria.tunnel == 'eastTunnel'? '東隧': order.criteria.tunnel == 'westTunnel'? '西隧': '任行' } </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="btn btn-default" 
                            data-dismiss="modal"
                            onClick={ _ => {
                                this.setState({ modal: null }, 
                                    _ => this.props.setShow(false));
                            }}
                        >
                            關閉視窗
                        </button>
                        {
                            this.props.user._id != order.orderBy._id && <button 
                            type="button" 
                                className="btn btn-success" 
                                data-dismiss="modal"
                                onClick={ async _ => {
                                    try {
                                        const data = await api.order.acceptOrder(order._id);
                                        this.props.setShow(false)
                                        this.setState({ modal: null });
                                        this.props.history.push('/order/'+data.data._id);
                                    } catch( error ){
                                        console.error(error);
                                        return window.alert("無法接受這個柯打。可能已經其他司機接受。")
                                    }
                                }}
                            >
                                接受柯打
                            </button>
                        }
                    </div>
                </React.Fragment>
            );
        }

        return <React.Fragment />;
    }

    componentDidMount(){

        if ( isLoad == false ){

            this.prompt(
                "修改車牌", 
                "請輸入你的新車牌號碼", 
                "車牌號碼", 
                async input => {
                    if ( input.trim() == "" ){
                        window.alert("你所輸入的車牌號碼不正確! ");
                    } else {
                        await api.user.updateVehicleRegNo(input);
                        this.alertClose();
                        await this.presenter.renewMe();
                    }
                });
        }


        isLoad = true;

        const _this = this;


        if ( BrowserSpeechRecognition ){
            this.recognition = new BrowserSpeechRecognition();
            this.recognition.onstart = event => 
                this.setState({ touch: true });
            this.recognition.onresult = event => {
                let result = "";
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    result = event.results[i][0].transcript;
                    this.setState({ touch: false }, _ => this.handleVoiceInput(result));
                }}    
            this.recognition.onend = function(){
                _this.setState({ touch: false });
            };

            this.recognition.onerror = function(){};
        }

        
    }

    recognize = () => {

        const _this = this;

        if ( window.plugins && window.plugins.speechRecognition ){
            const speechRecognition = window.plugins.speechRecognition;
            _this.setState({ touch: true });
            speechRecognition.startListening(
                function( result ){
                    _this.setState({ touch: false });
                    _this.handleVoiceInput(result[0]);
                },
                function(){
                    _this.setState({ touch: false });
                    return window.alert("無法識辨你的查詢, 請用\"去\"字分開你的起點, 終點, 及目的地");  
                },
                {
                    lang: 'yue-Hant-HK',
                    showPopup: true,
                    prompt: "正在聆聽 ... "
                }
            )

        } else if ( BrowserSpeechRecognition ) {
            if (this.state.touch )
                this.recognition.stop();
            else 
                this.recognition.start();
        } else 
            window.alert("錯誤", "你的裝置並不支持語音功能");
    }

    /**
     * 
     * For tab 設置 
     * 
     */
    renderSetting = props => {
        return (
            <div>
                <div className="setting-container">
                    <table className="table table-cs">
                        <tbody>
                            <tr>
                                <td style={{ width:'120px'}}> 用戶名字 </td>
                                <td> { this.props.me.username }</td>
                            </tr>
                            <tr>
                                <td style={{ width:'120px'}}> 用戶電話 </td>
                                <td> { this.props.me.telephone_no }</td>
                            </tr>
                            <tr>
                                <td style={{ width:'120px'}}> 車牌號碼 </td>
                                <td> { this.props.me.vehicle_reg_no }</td>
                            </tr>
                            <tr>
                                <td style={{ width:'120px'}}> 建立日期 </td>
                                <td> { moment( this.props.me.createdAt).format('YYYY-MM-DD')}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <ul className="order__tabs center">
                    <li
                       onClick={ _ => this.presenter.logout() } 
                    > 
                        登出 
                    </li>
                    <li> 使用條款 </li>
                    <li onClick={ _ => 
                        this.prompt(
                            "修改車牌", 
                            "請輸入你的新車牌號碼", 
                            "車牌號碼", 
                            async input => {
                                if ( input.trim() == "" ){
                                    window.alert("輸入不正確", "你所輸入的車牌號碼不正確! ");
                                } else {
                                    await api.user.updateVehicleRegNo(input);
                                    this.alertClose();
                                    await this.presenter.renewMe();
                                }
                            })
                        }> 
                            修改車牌 
                    </li>
                </ul>
            </div>
        )
    }


    /**
     * 
     * For tab 出貨
     * 
     */
    renderRelease = props => {

        return (
            <div className="order__release">
                <div className="order__form">
                    <div className="order__form__left">
                        <div className="form-group">
                            <input 
                                className="form-control" 
                                placeholder="起點" 
                                value={ props.release.start }
                                onChange={ event => this.handleChange('start', 'release')(event.target.value)}
                            />
                        </div>
                        
                        <div className="form-group">
                            <input 
                                className="form-control" 
                                placeholder="中途站" 
                                value={ props.release.mid }
                                onChange={ event => this.handleChange('mid', 'release')(event.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <input 
                                className="form-control" 
                                placeholder="終點" 
                                value={ props.release.end }
                                onChange={ event => this.handleChange('end', 'release')(event.target.value)}
                            />
                        </div>
                    </div>
                    <div className="order__form__right">
                        <div 
                            className="order__form__record-button"
                            onClick = {event => this.recognize() }
                        >
                            <i className="icon-volume-medium" style={{ color: this.state.touch? 'white': 'black'}}/>
                        </div>
                    </div>
                </div>
                <div className="order__select">
                    <div>
                        <div 
                            className={ this.state.release.tunnel == 'any'? 'selected': "bg-lightyellow black"}
                            onClick={ _ => this.handleChange('tunnel', 'release')('any')}
                        > 
                            任行 
                        </div>
                        <div 
                            className={ this.state.release.tunnel == 'eastTunnel'? 'selected': "bg-blue black"}
                            onClick={ _ => this.handleChange('tunnel', 'release')('eastTunnel')}
                        > 
                            東隧 
                        </div>
                        <div 
                            className={ this.state.release.tunnel == 'westTunnel'? 'selected': "bg-lightpink black"}
                            onClick={ _ => this.handleChange('tunnel', 'release')('westTunnel')}
                        > 
                            西隧 
                        </div>
                        <div 
                            className={ this.state.release.tunnel == 'HungHomTunnel'? 'selected': "bg-red"}
                            onClick={ _ => this.handleChange('tunnel', 'release')('HungHomTunnel')}
                        > 
                            紅隧 
                        </div>
                        <div 
                            className={ this.state.release.taxiType == 'red'? 'selected': "bg-red"}
                            onClick={ _ => this.handleChange('taxiType', 'release')('red')}
                        > 
                            紅的 
                        </div>
                        <div 
                            className={ this.state.release.taxiType == 'green'? 'selected': "bg-green"}
                            onClick={ _ => this.handleChange('taxiType', 'release')('green')}
                        > 
                            綠的 
                        </div>
                        <div 
                            className={ this.state.release.taxiType == 'blue'? 'selected': "bg-blue black"}
                            onClick={ _ => this.handleChange('taxiType', 'release')('blue')}
                        > 
                            籃的 
                        </div>
                    </div>
                    <div>
                        <div 
                            className={ this.state.release.passenger == 4? 'selected': "bg-green"}
                            onClick={ _ => this.handleChange('passenger', 'release')(4)}
                        > 
                            四人 
                        </div>

                        <div 
                            className={ this.state.release.passenger == 5? 'selected': "bg-green"}
                            onClick={ _ => this.handleChange('passenger', 'release')(5)}
                        > 
                            五人 
                        </div>
                        <div 
                            className={ this.state.release.passenger == 6? 'selected': "bg-green"}
                            onClick={ _ => this.handleChange('passenger', 'release')(6)}
                        > 
                            珍寶 
                        </div>
                        <div 
                            className={ this.state.release.passenger == 7? 'selected': "bg-green"}
                            onClick={ _ => this.handleChange('passenger', 'release')(7)}
                        > 
                            傷殘 
                        </div>
                    </div>
                    <div>
                        <div 
                            className={ this.state.release.payment == 'cash'? 'selected': "bg-lightyellow black"}
                            onClick={ _ => this.handleChange('payment', 'release')('cash')}
                        > 
                            現金 
                        </div>
                        <div 
                            className={ this.state.release.payment == 'creditCard'? 'selected': "bg-lightpink black"}
                            onClick={ _ => this.handleChange('payment', 'release')('creditCard')}
                        > 
                            信用卡 
                        </div>
                        <div 
                            className={ this.state.release.payment == 'alipay'? 'selected': "bg-blue black"}
                            onClick={ _ => this.handleChange('payment', 'release')('alipay')}
                        > 
                            支付寶 
                        </div>
                    </div>
                    <div>
                        <div 
                            className={ this.state.release.discount == 100? 'selected': "bg-lightyellow black"}
                            onClick={ _ => this.handleChange('discount', 'release')(100)}
                        > 
                            千足金 
                        </div>
                        <div 
                            className={ this.state.release.discount == 90? 'selected': "bg-lightpink black"}
                            onClick={ _ => this.handleChange('discount', 'release')(90)}
                        > 
                            九仔 
                        </div>
                        <div 
                            className={ this.state.release.discount == 85? 'selected': "bg-blue black"}
                            onClick={ _ => this.handleChange('discount', 'release')(85)}
                        > 
                            會員柯 
                        </div>
                        <div 
                            style={{ backgroundColor: '#5cb85c' }}
                            onClick={ async _ => {

                                if ( this.state.release.start == "" || this.state.release.end == "")
                                    return window.alert('請填寫你的起點及終點');

                                try {
                                    await api.order.makeOrder( 
                                        this.state.release.start,
                                        this.state.release.mid,
                                        this.state.release.end,
                                        {
                                            taxiType: this.state.release.taxiType,
                                            discount: this.state.release.discount,
                                            tunnel: this.state.release.tunnel,
                                            passenger: this.state.release.passenger
                                        }
                                    );

                                    window.alert('你已經成功送出柯打, 你可以在已出tab 或接貨頁面中查看或取消柯打');

                                    this.setState({
                                        release : {
                                            tunnel: 'any', taxiType: 'red',
                                            passenger: 4, payment: 'cash',
                                            discount: 100, start: '',
                                            mid: '', end: ''
                                        }
                                    }, _ => this.presenter.renewOrder() );

                                } catch( error ){
                                    window.alert('請檢查你的起點及終點 (提示: 使用一些比較有指標性的名字)');
                                }
                            }}
                        >
                            確定 
                        </div>
                    </div>
                </div>
            </div>
        )

    }

    handleVoiceInput = result => {
        const array = result.split('去');
        const original = JSON.parse(JSON.stringify(this.state));

        if ( array.length == 3 ){
            original.release.start = array[0];
            original.release.mid = array[1];
            original.release.end = array[2];
            return this.setState( original );
        }  else if ( array.length == 2 ){
            original.release.start = array[0];
            original.release.mid = "";
            original.release.end = array[1];
            return this.setState( original );
        } else 
            return window.alert("無法識辨你的查詢, 請用\"去\"字分開你的起點, 終點, 及目的地");  
    }

    /**
     * 
     * For tab 已出
     * 
     */
    renderOrderer = props => {

        return (
            <div className="order__list">
                { this.props.ordered.map( this.renderOrdered )}
            </div>
        )
    };

    renderOrdered = (order, index) => {

        const color = order.criteria.discount == 100? 'yellow': 
                            order.criteria.discount == 90? 'green':
                                'white';

        return (
            <div 
                className="order" 
                key={index} 
                // style={{ borderTop: `5px solid ${color}`}}
            >
                <div 
                    className="order__from_to" 
                    style={{ color:color}}
                    onClick={ _ => {
                        this.props.setHeader('查看柯打')
                        this.setState( _ => this.props.history.push('/order/'+ order._id));
                    }}
                >
                    <div className="from"> { order.start.address} </div>
                    <i className="icon-arrow-right7"/>
                    <div className="to"> { order.end.address } </div>
                </div>
                <ul className="order__tabs">
                    <li 
                        style={{ backgroundColor:'red'}}
                        onClick={ async() => {
                            await api.order.makeOrder( 
                                order.start.address,
                                order.mid? order.mid.address: "",
                                order.end.address,
                                {
                                    taxiType: order.criteria.taxiType,
                                    discount: order.criteria.discount,
                                    tunnel: order.criteria.tunnel,
                                    passenger: order.criteria.passenger
                                }
                            );

                            window.alert('成功重出柯打, 你可以在已出tab 或接貨頁面中查看或取消柯打');

                            this.presenter.renewOrder();
                        }}
                    > 
                        重出
                    </li> 
                    { 
                        order.status == "new" && <li 
                            style={{ backgroundColor:'red'}}
                            onClick={ async() => {
                                await api.order.cancelOrder(order._id);
                                await this.presenter.renewOrder();
                                window.alert( "成功刪除柯打!");
                            }}
                        > 
                            刪除
                        </li> 
                    }
                    {
                        order.status == "canceled" && <li
                            style={{ backgroundColor:'red'}}
                        > 
                            已取消
                        </li> 
                    }
                    {
                        order.status == "accepted" &&  <li
                            style={{ backgroundColor:'green'}}
                        > 
                            已接受
                        </li>
                    }      
                    {
                        order.status == "accepted" &&  <li
                            style={{ backgroundColor:'green'}}
                        > 
                            會員 {order.acceptBy.username}
                        </li>
                    }
                    <li
                        style={{ backgroundColor: order.criteria.taxiType }}
                    > 
                        { order.criteria.taxiType == 'green'? '綠的': order.criteria.taxiType == 'red'? '紅的': '籃的' }    
                    </li>
                    <li
                        style={{ backgroundColor: 'green' }}
                    > 
                        { order.criteria.discount == 100? '千足金': order.criteria.discount == 90? '九折': '八五折' } 
                    </li>
                    <li
                        style={{ backgroundColor: 'green' }}
                    > 
                        { order.criteria.passenger == 4? '四人': order.criteria.passenger == 5? '五人': order.criteria.passenger == 6? '珍寶': order.criteria.passenger == 7? '傷殘': "" } 的士
                    </li>
                    { 
                        (order.criteria.tunnel == 'HungHomTunnel' || order.criteria.tunnel == 'eastTunnel' ||  order.criteria.tunnel == 'westTunnel') && <li
                            style={{ backgroundColor: 'green' }}
                        > 
                            { order.criteria.tunnel == 'HungHomTunnel'? '紅隧': order.criteria.tunnel == 'eastTunnel'? '東隧': order.criteria.tunnel == 'westTunnel'? '西隧': '任行' }
                        </li>
                    }
                </ul>
                { 
                    order.criteria.required && <div className="order__remark"> 備註: { order.criteria.required } </div> }
            </div>
        )
    }

    /**
     * 
     * For tab 接貨
     * 
     */
    renderOrders = props => (
        <div className="order__list">
            { this.props.orders.map( this.renderOrder )}
        </div>
    );

    renderOrder = (order, index) => {

        const color = order.criteria.discount == 100? 'yellow': 
                            order.criteria.discount == 90? 'green':
                                'white';

        console.log(order)

        return (
            <div 
                className="order" 
                key={index} 
            >
                <div 
                    className="order__from_to" 
                    style={{ color:color}}
                    onClick={ _ => {
                        this.props.setHeader('查看柯打')
                        this.setState({ modal: {
                            type: 'previewOrder',
                            order: order
                        }}, _ => this.props.setShow(true));
                    }}
                >
                    <div className="from"> { order.start.address} </div>
                    <i className="icon-arrow-right7"/>
                    <div className="to"> { order.end.address } </div>
                </div>
                <ul className="order__tabs">
                    { 
                        this.props.user._id == order.orderBy._id && <li 
                            style={{ backgroundColor:'red'}}
                            onClick={ async() => {
                                await api.order.cancelOrder(order._id);
                                await this.presenter.renewOrder();
                                window.alert("成功刪除柯打!");
                            }}
                        > 
                            刪除
                        </li> 
                    }
                    <li> 會員 { order.orderBy.username } </li>
                    {
                        order.status == "accepted" &&  <li
                            style={{ backgroundColor:'green'}}
                        > 
                            會員 {order.acceptBy.username}
                        </li>
                    }
                    <li
                        style={{ backgroundColor: order.criteria.taxiType }}
                    > 
                        { order.criteria.taxiType == 'green'? '綠的': order.criteria.taxiType == 'red'? '紅的': '籃的' }    
                    </li>
                    <li
                        style={{ backgroundColor: 'green' }}
                    > 
                        { order.criteria.discount == 100? '千足金': order.criteria.discount == 90? '九折': '八五折' } 
                    </li>
                    <li
                        style={{ backgroundColor: 'green' }}
                    > 
                        { order.criteria.passenger == 4? '四人': order.criteria.passenger == 5? '五人': order.criteria.passenger == 6? '珍寶': order.criteria.passenger == 7? '傷殘': "" } 的士
                    </li>
                    { 
                        (order.criteria.tunnel == 'HungHomTunnel' || order.criteria.tunnel == 'eastTunnel' ||  order.criteria.tunnel == 'westTunnel') && <li
                            style={{ backgroundColor: 'green' }}
                        > 
                            { order.criteria.tunnel == 'HungHomTunnel'? '紅隧': order.criteria.tunnel == 'eastTunnel'? '東隧': order.criteria.tunnel == 'westTunnel'? '西隧': '任行' }
                        </li>
                    }
                </ul>
                { 
                    order.criteria.required && <div className="order__remark"> 備註: { order.criteria.required } </div> }
            </div>
        )
    }


    handleChange = (field, inner) => value => {
        const stateChange = JSON.parse(JSON.stringify(this.state))
        if(inner)
            stateChange[inner][field] = value;
        else
            stateChange[field] = value;
        this.setState(stateChange);
    }

    render(){
        return (
            <div className="main__background">

                {
                    this.state.alert.type == "text" && <SweetAlert
                        show={this.state.alert.show}
                        title={this.state.alert.title}
                        text={this.state.alert.text}
                        onConfirm={_ =>this.handleChange("show", 'alert')(false)}
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


                <div className="main__section">
                    { this.state.tab == "orders" && <this.renderOrders /> }
                    { this.state.tab == "released" && <this.renderOrderer /> }
                    { this.state.tab == "release" && <this.renderRelease { ... this.state } /> }
                    { this.state.tab == "setting" && <this.renderSetting /> }
                </div>

                <div className="main__sidebar">
                    <ul className="main__sidebar__list">
                        <li 
                            className={ this.state.tab == 'orders'? 'active': '' }
                            onClick={ _ => this.handleChange('tab')('orders') }
                        >
                            接貨
                        </li>
                        <li 
                            className={ this.state.tab == 'release'? 'active': '' }
                            onClick={ _ => this.handleChange('tab')('release') }
                        >
                            出貨
                        </li>
                        <li 
                            className={ this.state.tab == 'released'? 'active': '' }
                            onClick={ _ => this.handleChange('tab')('released') }
                        >
                            已出
                        </li>
                        <li 
                            className={ this.state.tab == 'setting'? 'active': '' }
                            onClick={ _ => this.handleChange('tab')('setting') }
                        >
                            設定
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

}

export default (withModal(View));