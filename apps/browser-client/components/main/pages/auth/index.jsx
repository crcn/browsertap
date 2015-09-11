var React          = require("react");
var Login          = require("./login");
var ResetPassword  = require("./reset-password");
var ForgotPassword = require("./forgot-password");
var Signup         = require("./signup");
var Confirmed      = require("./confirmed");

/**
 */

var AuthPages = React.createClass({
  render: function() {
 
    var element = {
      login          : <Login {...this.props} />,
      signup         : <Signup {...this.props} />,
      resetPassword  : <ResetPassword {...this.props} />,
      forgotPassword : <ForgotPassword {...this.props} />,
      confirmed      : <Confirmed {...this.props} />
    }[this.props.location.state.authPage];

    return <div className="m-browser-client-auth">
      { element }
    </div>;
  }
});

/**
 */

export default AuthPages;