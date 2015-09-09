import React from "react";
import Auth  from "./pages/auth";


var Main = React.createClass({
  render: function() {
    return <Auth {...this.props} />;
  }
});

module.exports = Main;