var React = require("react");
var Pages = require("./pages");

var Main = React.createClass({
  componentDidMount: function() {
    this.props.location.on("change", this.onChange);
  },
  onChange: function() {
    this.forceUpdate();
  },
  render: function() {
    return <Pages {...this.props} />;
  }
});

module.exports = Main;