var React                 = require("react");
var Login                 = require("./login");
var ResetPassword         = require("./reset-password");
var ForgotPassword        = require("./forgot-password");
var Signup                = require("./signup");
var Confirmed             = require("./confirmed");
var RequestInvite         = require("./request-invite");
var RequestInviteComplete = require("./request-invite-complete");
var Invited               = require("./invited");

/**
 */

var AuthPages = React.createClass({
  render: function() {

    var element = {
      login                 : <Login {...this.props} />,
      signup                : this.props.app.config.beta ? <RequestInvite {...this.props} /> : <Signup {...this.props} />,
      resetPassword         : <ResetPassword {...this.props} />,
      requestInviteComplete : <RequestInviteComplete {...this.props} />,
      forgotPassword        : <ForgotPassword {...this.props} />,
      confirmed             : <Confirmed {...this.props} />,
      invited               : <Invited {...this.props} />
    }[this.props.location.state.authPage];

    return <div className="m-browser-client-auth">
      { element }
    </div>;
  }
});

/**
 */

export default AuthPages;