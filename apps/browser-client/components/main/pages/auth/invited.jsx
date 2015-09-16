import React     from "react";
import DataForm  from "common/components/data-form";
import ForgotPasswordForm from "common/data/forms/forgot-password";
// import Link      from "common/components/link"

import {IntlMixin, FormattedMessage, FormattedHTMLMessage }    from "react-intl";

var Invitied = React.createClass({

  mixins: [IntlMixin],

  render: function() {
    return <div className="auth-invited">
      <span className="message"> 
        <FormattedHTMLMessage message={this.getIntlMessage("invited.message")} inviter={this.props.location.state.inviter.name} />
      </span>

      <a href={"#" + this.props.app.router.getPath("signup", { query: { shortcode: this.props.location.state.shortcode }})}>
        <FormattedHTMLMessage message={this.getIntlMessage("invited.signupButtonLabel")} />
      </a>
    </div>;
  }
});
 
export default Invitied;