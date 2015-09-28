var React = require("react");

var RemoteDesktopWindow = React.createClass({
  getInitialState:function() {
    return {}
  },
  show:function() {
    this.props.win.show().then(function(peer) {
      this.peer = peer;
      peer.on("change", this.onChange);
    }.bind(this));
  },
  onChange: function() {
    this.setState({
      videoUrl: this.peer.videoUrl
    })
  },
  render: function() {
    return <div className="m-remote-desktop-screen"> 
     { this.state.videoUrl ? <video src={this.state.videoUrl} /> : this._renderInfo() }
    </div>
  },
  _renderInfo: function() {
    return <div>
      {JSON.stringify(this.props.win)} <button onClick={this.show}>show</button>
    </div>;
  }
});

module.exports = RemoteDesktopWindow;