var React = require("react");

var RemoteDesktopWindow = React.createClass({
  componentDidMount: function() {
    if (this.props.win.title != "") {
      this.props.win.show();
    }
  },
  render: function() {
    return <div className="m-remote-desktop-screen">
      { this.props.win.title } 
    </div>
  }
});

module.exports = RemoteDesktopWindow;