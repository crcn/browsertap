import React         from "react";
import GroundControl from "./ground-control"
import Portal        from "browser-client/components/common/portal"
import Toolbar       from "./toolbar"
import RemoteDesktopComponent from "./remote-desktop";


var App = React.createClass({
  getInitialState: function() {
    return {
      screens: []
    }
  },
  render: function() {
    return <div className="m-browser-client-app">

      {
        String(Boolean(this.props.location.query.showControls)) !== "false" ? 
        <Portal><GroundControl {...this.props} /></Portal> 
        : void 0 
      } 

      <RemoteDesktopComponent />

      <Toolbar {...this.props} /> 
    </div>;
  }
}); 

module.exports = App;  