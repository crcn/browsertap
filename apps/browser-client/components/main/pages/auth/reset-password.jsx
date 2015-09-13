import React             from "react";
import DataForm          from "common/components/data-form";
import ResetPasswordForm from "common/data/forms/reset-password";

var ResetPassword = React.createClass({
  onSuccess: function() {
    this.props.app.router.redirect("login", {
      query: {
        showMessage: "authResetPassword.loginWithNewPassword"
      }
    })
  },
  render: function() {

    var data = {
      token: this.props.location.state.token
    };
 
    return <DataForm title="authResetPassword.title" onSuccess={this.onSuccess} formClass={ResetPasswordForm} {...this.props} data={data}  submitLabel="authResetPassword.submitLabel" />;
  }
});
 
export default ResetPassword;