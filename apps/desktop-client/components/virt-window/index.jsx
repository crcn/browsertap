import React from "react";
import VirtualWindow from "desktop-client/data/models/virt-window";

var VirtWindowComponent = React.createClass({
  componentDidMount: async function() {

    var virtualWindow = await VirtualWindow.findOne(this.props.bus, {
      _id: this.props.virtualWindow._id
    });

    console.log(virtualWindow);
  },
  render: function() {
    return <div>
      virtual window
    </div>;
  }
});

export default VirtWindowComponent;
