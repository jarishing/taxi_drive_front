const React = require('react');

class Model extends React.Component{

    constructor(props){
        super(props);
        this.presenter = props.presenter;
        this.presenter.setModel(this);
    }

    update = state => 
        this.setState(state);

    render(){
        const { children } = this.props;

        const childrenWithProps = React.Children.map(children, child =>
            React.cloneElement(child, { ... this.state, ... this.props })
        );
        return <React.Fragment>{childrenWithProps}</React.Fragment>
    }
}

class Presenter {
    setView(view){
        this.view = view;
    } 
    setModel(model){
        this.model = model;
    }
}


class View extends React.PureComponent {

    constructor(props) {
        super(props);
        this.presenter = props.presenter;
        this.presenter.setView(this);
    }

    handleChange = (field, inner) => value => {
        const stateChange = JSON.parse(JSON.stringify(this.state))
        if(inner)
            stateChange[inner][field] = value;
        else
            stateChange[field] = value;
        this.setState(stateChange);
    }

    
}

const connect = (Model, Presenter, View) => props => {
    const _presenter = new Presenter();
    const view = React.createElement(View, { ...props, presenter: _presenter });
    const model = React.createElement(Model, { presenter: _presenter }, view);
    return model;
};

module.exports = exports = connect;
exports.Model = Model;
exports.View = View;
exports.Presenter = Presenter;
