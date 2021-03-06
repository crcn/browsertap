import React from "react";
import Pages from "./pages";

var Main = React.createClass({
  componentDidMount: function() {
    this.props.location.watch(this.onChange);
  },
  onChange: function() {
    this.forceUpdate();
  },
  render: function() {
    return <Pages {...this.props} />;
  }
});

module.exports = Main;
