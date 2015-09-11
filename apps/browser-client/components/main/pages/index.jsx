import React from "react";
import Auth  from "./auth";
import App   from "./app"; 

var Pages = React.createClass({
  render: function() {
    return {
      auth: <Auth {...this.props} />,
      app: <App {...this.props} />
    }[this.props.location.state.mainPage] || <div>not found</div>; 
  }
});

module.exports = Pages;