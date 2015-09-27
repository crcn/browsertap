import React         from "react";
import GroundControl from "./ground-control"
import Portal        from "browser-client/components/common/portal"
import Toolbar       from "./toolbar"
import RemoteDesktop from "common/remote-desktop";


var App = React.createClass({
  getInitialState: function() {
    return {
      screens: []
    }
  },
  componentDidMount: function() {
    var rd = new RemoteDesktop({
      host: "ws://localhost:9000"
    });

    rd.getScreens().then(function(screens) {
      this.setState({
        screens: screens
      })
    }.bind(this));
  },
  render: function() {
    return <div className="m-browser-client-app">

      {
        String(Boolean(this.props.location.query.showControls)) !== "false" ? 
        <Portal><GroundControl {...this.props} /></Portal> 
        : void 0 
      } 

      <ul>
      {this.state.screens.map(function(screen) {
        return <li><span>{ "screen " + screen.title}</span></li>;
      })}
      </ul> 

      <Toolbar {...this.props} /> 
    </div>;
  }
}); 

module.exports = App;  