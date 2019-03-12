import api from '../../api';
import {connect} from 'react-redux';
import MVP from '../../utils/mvp';
import { withRouter } from 'react-router-dom';
import Socket from '../../socket';
import { withCookies } from 'react-cookie';
import Cookie from '../../cookie';

let isLoad = false;

class Model extends MVP.Model{
    
    constructor(props){
        super(props);
        this.state = {
            orders: [],
            me: {},
            ordered: [],
            takenOrder: []
        };
    }

    handleChange = (field, inner) => value => {
        const stateChange = JSON.parse(JSON.stringify(this.state))
        if(inner)
            stateChange[inner][field] = value;
        else
            stateChange[field] = value;
        this.setState(stateChange);
    }
    
    clearCookieAndGoBack = () => {
        this.cookie.clear(this.props.cookies);
        this.props.history.replace('/');
    }

    getOrder = async() => {
        let orders = api.order.getOrder("new");
        let ordered = api.order.getOrdererOrder();
        let takenOrder = api.order.getTakenOrder();
        [ orders, ordered, takenOrder ] = await Promise.all([ orders, ordered, takenOrder]);

        this.setState({ orders: orders, ordered: ordered, takenOrder:takenOrder });
    }

    getMe = async() => {
        const accessToken = this.props.accessToken;
        const userId = this.props.user._id;
        const user = await api.user.getMe(userId, accessToken);
        this.setState({ me: user });
    }

    componentWillMount(){
        if ( this.props.user == null )
            return this.props.history.replace('/');

        const { cookies } = this.props;
        this.cookie = new Cookie(cookies.getAll());

        this.getOrder();
        this.getMe();

        Socket.listen(async event => {
            console.log(event);

            if (/ORDER_OVERTIME_CONFIRM-/ig.test(event))
                return this.presenter.confirmOvertime( event.split('-')[1]);

            switch(event){
                case 'RENEW_ORDER_LIST':
                    await this.getOrder();
                    break;
                // case 'ORDER_OVERTIME_CONFIRM':
                    // this.presenter.confirmOvertime();
                    break;
                case 'ORDER_OVERTIME_DEL':
                    await this.getOrder();
                    break;
            }
        });


    }

    async askCarNumber(){
        isLoad = true;
        setTimeout(async() => {
            const input = window.prompt("請輸入你的新車牌號碼");
            if ( input != null && input.trim() !== "" ){
                await api.user.updateVehicleRegNo(input);
                await this.presenter.renewMe();
            }
        }, 1000);
    }

    componentWillUnmount(){
        Socket.mute();
    }

    componentDidMount(){
        if ( this.props.user )
            this.askCarNumber()
    }

    componentDidUpdate(){
        if ( this.props.user && isLoad == false )
            this.askCarNumber()
    }

}

const mapStateToProps = ( state, ownProps ) => ({
    user: state.base.user,
    accessToken: state.base.accessToken
});

const mapDispatchToProps = ( dispatch, ownProps ) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withCookies(Model)));