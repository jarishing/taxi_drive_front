import React from 'react';
import {connect} from 'react-redux';
import View from './changePw.view';
import Model from './changePw.model';

class ForgetPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            oldpw: '',
            newpw: '',
            newpwconfirm: ''
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

const mapStateToProps = ( state, ownProps ) => ({
    user: state.base.user,
    accessToken: state.base.accessToken
});

const mapDispatchToProps = ( dispatch, ownProps ) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPage);
