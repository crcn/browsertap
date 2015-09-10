var React          = require("react");
var Login          = require("./login");
var ResetPassword  = require("./reset-password");
var ForgotPassword = require("./forgot-password");
var Signup         = require("./signup");

/**
 */

var AuthPages = React.createClass({
  render: function() {

    var page = "resetPassword"; 
 
    var element = {
      login         : <Login {...this.props} />,
      signup        : <Signup {...this.props} />,
      resetPassword : <ResetPassword {...this.props} />,
      forgotPassword: <ForgotPassword {...this.props} />
    }[page];

    return <div className="row">
      <div className="m-browser-client-auth">
        { element }
      </div>
    </div>;

  }
});

/**
 */

export default AuthPages;