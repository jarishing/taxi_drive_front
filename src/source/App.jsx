import React from 'react';
import { installModal } from './components/modal/modal';
import 'sweetalert/dist/sweetalert.css';
import Socket from './socket';
import noop from 'lodash.noop';
// import permission from './permission';

class App extends React.Component {

    constructor(props){
        super(props);
    }

    componentWillMount(){
        Socket.connect();

        // permission();

        if ( window.plugins )
            if ( window.plugins.speechRecognition )
                // This method verifies if the application has the permissions for the usage of the microphone:
                window.plugins.speechRecognition.hasPermission(function(isGranted){
                    if ( isGranted == false )
                        window.plugins.speechRecognition.requestPermission( 
                            () => console.log('Permission granted'), 
                            () => console.log("Error on granted")
                        );
                    else
                        console.log('Permission granted')
                }, 
                () => console.log('Error on check')
            );
        else
            window.alert('你的裝置並不支持語音功能');
    }

    render(){
        return (
            <React.Fragment> 
                { ... this.props.children } 
            </React.Fragment>
        );
    }
};

export default installModal(App);