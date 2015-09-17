import React         from "react";
import GroundControl from "./ground-control"
import Portal        from "browser-client/components/common/portal"
import Toolbar       from "./toolbar"
import RemoteDesktop from "common/remote-desktop";


var App = React.createClass({
  componentDidMount: function() {
    var rd = new RemoteDesktop({
      host: "http://0.0.0.0:8090"
    });
  },
  render: function() {
    return <div className="m-browser-client-app">

      {
        String(Boolean(this.props.location.query.showControls)) !== "false" ? 
        <Portal><GroundControl {...this.props} /></Portal> 
        : void 0 
      } 

      <Toolbar {...this.props} /> 
    </div>;
  }
}); 

module.exports = App;  