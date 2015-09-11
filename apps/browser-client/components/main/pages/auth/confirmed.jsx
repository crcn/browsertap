import React     from "react";
import DataForm  from "common/components/data-form";
import ForgotPasswordForm from "common/data/forms/forgot-password";
// import Link      from "common/components/link"

import {IntlMixin, FormattedMessage, FormattedHTMLMessage }    from "react-intl";


var Confirmed = React.createClass({

  mixins: [IntlMixin],

  render: function() {

    var error = this.props.location.state.error;

    return <div className="confirmed-account">
      <div className={"alert " + "alert-" + (error ? "danger" : "success")}>
        { error ? <FormattedMessage message={this.getIntlMessage("errors." + error.message)} /> : <FormattedMessage message={this.getIntlMessage("authConfirmed.thanks")} /> }
      </div>
    </div>;
  }
});
 
export default Confirmed;