var React             = require("react");

/*
*/

var Portal = React.createClass({

    componentDidMount: function() {
        this.element = document.createElement("div");
        document.body.appendChild(this.element);
        this._renderLayer();
    },

    componentWillUnmount: function() {
        React.unmountComponentAtNode(this.element);
        document.body.removeChild(this.element);
    },

    shouldComponentUpdate: function() {
        React.render(this.props.children, this.element);
        return true;
    },

    _renderLayer: function() { 
        React.render(this.props.children, this.element);
    },

    // Placeholder to satisfy render
    render: function() {
        return null;
    }

});

module.exports = Portal;
