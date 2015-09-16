import React     from "react";
import DataForm  from "common/components/data-form";
import LoginForm from "common/data/forms/login";
// import Link      from "common/components/link"

import {IntlMixin, FormattedMessage, FormattedHTMLMessage }    from "react-intl";

var RequestInviteComplete = React.createClass({

  mixins: [IntlMixin],
  render: function() {
    return <div className="request-invite-complete">
      <span className="message"> 
        <FormattedMessage message={this.getIntlMessage("authRequestInviteComplete.message")} />
      </span>
      <span className="cta"> 
        <FormattedMessage message={this.getIntlMessage("authRequestInviteComplete.cta")} />
      </span>
      <input className="form-control" type="text" editable={false} defaultValue={this.props.app.config.hosts.browser + "/#/invite/" + this.props.location.query.shortcode } />
    </div>;
  }
});

export default RequestInviteComplete;
