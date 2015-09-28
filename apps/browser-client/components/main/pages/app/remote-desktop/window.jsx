var React = require("react");

var RemoteDesktopWindow = React.createClass({
  getInitialState:function() {
    return {}
  },
  componentDidMount: function() { 
    if (this.props.win.title != "") {
      this.props.win.show().then(function(peer) {
        this.peer = peer;
        peer.on("change", this.onChange);
      }.bind(this));
    }
  },
  onChange: function() {
    this.setState({
      videoUrl: this.peer.videoUrl
    })
  },
  render: function() {
    return <div className="m-remote-desktop-screen"> 
     { this.state.videoUrl ? <video src={this.state.videoUrl} /> : void 0 }
    </div>
  }
});

module.exports = RemoteDesktopWindow;