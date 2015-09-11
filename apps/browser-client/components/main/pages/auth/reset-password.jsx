import React             from "react";
import DataForm          from "common/components/data-form";
import ResetPasswordForm from "common/data/forms/reset-password";

var ResetPassword = React.createClass({
  render: function() {

    var data = {
      token: this.props.location.state.token
    };
 
    return <DataForm formClass={ResetPasswordForm} {...this.props} data={data} successMessage="authResetPassword.successMessage"  submitLabel="authResetPassword.submitLabel" />;
  }
});
 
export default ResetPassword;