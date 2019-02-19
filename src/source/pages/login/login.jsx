import React from 'react';
import model from './login.model';
import View from './login.view';
import { action } from '../../modules';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import Cookie from '../../cookie';
import api from '../../api';
import Socket from '../../socket';

class Login extends React.Component {

    constructor(props){
        super(props);
        this.state = { 
            phone: "", 
            password: "", 
            remainder: false,
            alert: {
                show: false,
                title: "",
                text: "",
                type: "text",
                placeholder: "",
                onConfirm: input => {
                    console.log(input);
                }
            }
        };
        this.model = model.bind(this)();
    };

    async componentDidMount(){
        const { cookies } = this.props;
        this.cookie = new Cookie(cookies.getAll());
        if ( this.cookie.access_token ){
            let user = await api.user.getMe( this.cookie.userId, this.cookie.access_token);
            if ( user ){
                this.props.setUser( user, this.cookie.access_token);
                this.props.history.push('/main');
                Socket.whatIsMe();
                // Socket.renewLocation();
            } else 
                this.cookie.clear(cookies);
        };  
    };

    render(){
        return (
            <View 
                { ... this.model }
                { ... this.props }
                { ... this.state }
            />
        );
    };
};

const mapStateToProps = ( state, ownProps ) => ({
    user: state.base.user 
});

const mapDispatchToProps = ( dispatch, ownProps ) => ({
    setUser: (user, accessToken) => dispatch(action.base.setUser(user, accessToken))
});

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(Login));
