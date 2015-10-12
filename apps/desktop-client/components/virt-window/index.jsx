import React from "react";
import VirtualWindow from "desktop-client/data/models/virt-window";

var VirtWindowComponent = React.createClass({
  getInitialState: function() {
    return { }
  },
  componentDidMount: async function() {

    var virtualWindow = await VirtualWindow.findOne(this.props.bus, {
      _id: this.props.virtualWindow._id
    });

    var peer = await virtualWindow.startCapture();

    this.setState({
      videoUrl: await peer.getPropertyAsync("videoUrl")
    })
  },
  onResize: function() {
    console.log("RESIZ");
  },
  render: function() {
    return <div>
      {
        !this.state.videoUrl ?
        "loading..."         :
        <video src={this.state.videoUrl} autoPlay="true" onResize={this.onResize} />
      }
    </div>;
  }
});

export default VirtWindowComponent;
