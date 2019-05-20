import React from 'react';
import View from './forget.view';
import Model from './forget.model';

class ForgetPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            tele:'',
            username:''
        };
        this.model = Model.bind(this)();
    };

    async componentWillMount(){
    };

    async componentDidUpdate(){
    }

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

export default ForgetPage;
