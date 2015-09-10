import React             from "react";
import DataForm          from "common/components/data-form";
import ResetPasswordForm from "common/data/forms/reset-password";

var ResetPassword = React.createClass({
  render: function() {

    var data = {
      token: { _id: "123456789123456789123456" }
    };
 
    return <DataForm formClass={ResetPasswordForm} {...this.props} data={data} />;
  }
});
 
export default ResetPassword;