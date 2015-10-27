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
    return <div className="m-browser-client-main">
      <Pages {...this.props} />
    </div>;
  }
});

module.exports = Main;
