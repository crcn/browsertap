var React           = require("react");
var Window          = require("./window");
import RemoteDesktop from "common/remote-desktop";
import throttle      from "lodash/function/throttle";

var RemoteDesktopComponent = React.createClass({
  getInitialState: function() {
    return {
      windows: []
    };
  },
  componentDidMount: function() {
    var rd = new RemoteDesktop({
      host: "ws://localhost:9000"
    }); 

    rd.bus({ name: "spy" }).on("data", this._onResponse);

    rd.getWindows().then(function(windows) {
      this.setState({
        windows: windows
      })
    }.bind(this));

  },
  _onResponse: function(response) {
    // TODO - error checking here  
    response
    .once("end", this._onChange); 
  },
  _onChange: function() {
    this.forceUpdate();
  },
  render: function() {
    return <div className="m-remote-desktop">
      {
        this.state.windows.map(function(win) {
          return <Window key={win.id} win={win} />
        })
      }
    </div>
  }
});

module.exports = RemoteDesktopComponent;