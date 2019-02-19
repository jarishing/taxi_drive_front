import api from '../../api';
import {connect} from 'react-redux';
import MVP from '../../utils/mvp';

class Model extends MVP.Model{
    
    constructor(props){
        super(props);
        this.state = {};
    }

}

const mapStateToProps = ( state, ownProps ) => ({
    user: state.base.user
});

const mapDispatchToProps = ( dispatch, ownProps ) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Model);