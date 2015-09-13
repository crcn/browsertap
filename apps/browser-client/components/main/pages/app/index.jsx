import React from "react";

var App = React.createClass({
  render: function() {
    return <div>{
      JSON.stringify(this.props.location.user) 
    }</div>;
  }
});

module.exports = App;