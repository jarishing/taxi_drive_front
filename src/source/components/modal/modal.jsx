import React from 'react';

let setComponent = null;
let setShow = null;
let setHeader = null;

export function installModal( WrappedComponent ){

    return class extends React.Component {

        constructor(props){
            super(props);
            this.state = { 
                show: false,
                header: "Modal Header",
                component: props => <React.Fragment/> 
            };
        }

        componentWillMount = _ => {
            setComponent = component => this.setState({ component });
            setShow = show => this.setState({ show });
            setHeader = header => this.setState({ header });
        }

        render(){
            return (
                <React.Fragment>
                    <div
                        className={"modal fade" + (this.state.show? " in block": "") } 
                        role="dialog"
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button 
                                        type="button" 
                                        className="close" 
                                        onClick={ _ => this.setState({ show: false })}
                                    >
                                        ×
                                    </button>
                                    <h4 className="modal-title">{this.state.header}</h4>
                                </div>
                                <this.state.component />
                            </div>
                        </div>
                    </div>
                    <WrappedComponent {... this.props } />
                </React.Fragment>
            )
        }
    }
}

function withModal( WrappedComponent ){
    return class extends React.Component {

        componentDidMount = () =>
            setComponent(this.refs.wrapped.renderModal);
        
        render(){
            return <WrappedComponent 
                            { ... this.props }  
                            ref="wrapped"
                            setShow={ setShow }
                            setHeader={ setHeader }
                    /> 
        }
    }
}


export default withModal;