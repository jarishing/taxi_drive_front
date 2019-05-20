import api from '../../api';
import Cookie from '../../cookie';

export default function(){
    
    const onValueChange = ( field, value ) => {
        let result = { ... this.state };
        result[field] = value;
        this.setState( result );
    };

    const onSubmit = async() => {
        let result = { ... this.state };


        if( result.newpw != result.newpwconfirm )
            return window.alert('您的新密碼確認並不相同，請重新輸入');

        let body = {
            old_pw: result.oldpw,
            new_pw: result.newpw
        };

        let response = await api.user.changePw( body, this.props.user._id, this.props.accessToken );
        if( !response )
            return;
        
        window.alert('你已經更新了密碼，請用這密碼登入');
        this.props.history.push('/main');
    }

    const onBack = () => {
        this.props.history.push('/main');
    }

    return { onValueChange, onSubmit, onBack };
}