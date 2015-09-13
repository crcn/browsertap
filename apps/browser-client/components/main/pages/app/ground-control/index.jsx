import React from "react";
import Pages from "./pages"

var GroundControl = React.createClass({
  render: function() {
    return <div className="m-browser-client-ground-control">
      <Pages {...this.props} />
    </div>
  } 
}); 

export default GroundControl; 