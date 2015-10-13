import React from "react";

var RootComponent = React.createClass({
  propTypes: {
    bus: React.PropTypes.object
  },
  componentDidMount: function() {
    this._spy();
  },
  _spy: async function() {
    var spy = this.bus({
      name: "spy"
    });
    var chunk
    while(chunk = await spy.read()) {
    }
  },
  render: function() {
    return this.children;
  }
});

export default RootComponent;
