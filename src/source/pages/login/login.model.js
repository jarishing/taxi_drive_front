import api from '../../api';

export default function(){
    
    const onFieldChange = ( field, value ) => {
        let state = { ... this.state };
        state[field] = value;
        this.setState( state );
    };


    const handleChange = (field, inner) => value => {
        const stateChange = JSON.parse(JSON.stringify(this.state))
        if(inner)
            stateChange[inner][field] = value;
        else
            stateChange[field] = value;
        this.setState(stateChange);
    }


    const alert = ( title, text ) => {
        const state = JSON.parse(JSON.stringify(this.state));
        state.alert.title = title;
        state.alert.text = text;
        state.alert.show = true;
        state.alert.type = 'text';
        this.setState( state );
    }

    const submit = async () => {
        
        const { phone, password } = this.state;

        // return this.props.history.replace('/main');

        if ( phone.trim() === '' || password.trim() === '' )
            return this.model.alert("登入錯誤", '用戶電話及密碼不能留空!');

        try {
            let data = await api.user.login(phone, password);
            this.props.setUser( data.user, data.access_token );
            this.cookie.access_token = data.access_token;
            this.cookie.userId = data.user._id;
            this.cookie.save( this.props.cookies );
            this.props.history.replace('/main');
        } catch ( error ){
            console.error(error);
            return this.model.alert("登入錯誤", '密碼錯誤或賑號未被認證');
        }

        this.props.history.push('/main');

    };

    return { onFieldChange, submit, alert, handleChange };
}