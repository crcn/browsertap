var React = require("react");
var cx    = require("classnames");

var Toolbar = React.createClass({
  render: function() {

    var toolBarPosition = Number(this.props.location.query.toolBarPosition || 0);
 
    var className = cx({
      "top left"     : toolBarPosition === 0,
      "top right"    : toolBarPosition === 1,
      "bottom left"  : toolBarPosition === 2,
      "bottom right" : toolBarPosition === 3,
      "m-browser-client-toolbar": true 
    }); 

    return <div className={className}>
      tools 
    </div>
  }
});

export default Toolbar;