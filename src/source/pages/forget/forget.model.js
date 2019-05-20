import api from '../../api';

export default function(){
    
    const onValueChange = ( field, value ) => {
        let result = { ... this.state };
        result[field] = value;
        this.setState( result );
    };

    const onSubmit = async() => {
        let result = { ... this.state };
        let body = {
            type: 'driver',
            "telephone_no": result.tele,
            "username": result.username
        };


        let response = await api.user.forgetPassword( body );
        if( !response )
            return;
        
        window.alert('你將會在以訊息收到一個全新的密碼，請用這密碼登入');
        this.props.history.push('/');
    }

    const onBack = () => {
        this.props.history.push('/');
    }

    return { onValueChange, onSubmit, onBack };
}