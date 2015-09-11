import React from "react";
import Auth  from "./pages/auth";

var Main = React.createClass({
  componentDidMount: function() {
    this.props.location.on("change", this.onChange); 
  },
  onChange: function() {
    this.forceUpdate();
  },
  render: function() {
    return <div className="container m-browser-client-main">
      <Auth {...this.props} />
    </div>;
  }
});

module.exports = Main;