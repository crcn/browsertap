import React from "react";
import Auth  from "./pages/auth";

var Main = React.createClass({
  render: function() {
    return <div className="container m-browser-client-main">
      <Auth {...this.props} />
    </div>;
  }
});

module.exports = Main;