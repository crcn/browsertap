var React    = require("react");
var Home     = require("./home");
var Contact  = require("./contact");
var NotFound = require("./not-found");

var Pages = React.createClass({
  render: function() {
    switch(this.props.location.state.bodyPage) {
      case "home"     : return <Home {...this.props} />;
      case "contact"  : return <Contact {...this.props} />;
      default         : return <NotFound {...this.props} />;
    }
  }
});

module.exports = Pages;