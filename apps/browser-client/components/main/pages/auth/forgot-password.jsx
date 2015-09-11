import React     from "react";
import DataForm  from "common/components/data-form";
import ForgotPasswordForm from "common/data/forms/forgot-password";
// import Link      from "common/components/link"

import {IntlMixin, FormattedMessage, FormattedHTMLMessage }    from "react-intl";


var ForgotPassword = React.createClass({

  mixins: [IntlMixin],

  render: function() {
    return <div className="forgot-password-form">
      <DataForm formClass={ForgotPasswordForm} {...this.props} successMessage="authForgotPassword.successMessage" submitLabel="authForgotPassword.submitLabel" />
    </div>;
  }
});
 
export default ForgotPassword;