var React          = require("react");
var Login          = require("./login");
var ResetPassword  = require("./reset-password");
var ForgotPassword = require("./forgot-password");
var Signup         = require("./signup");

/**
 */

var AuthPages = React.createClass({
  render: function() {

    var page = "login";

    switch(page) {
      case "login"          : return <Login {...this.props} />;
      case "signup"         : return <Signup {...this.props} />;
      case "resetPassword"  : return <ResetPassword {...this.props} />;
      case "forgotPassword" : return <ForgotPassword {...this.props} />;
    }
  }
});

/**
 */

export default AuthPages;