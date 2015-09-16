import React             from "react";
import DataForm          from "common/components/data-form";
import RequestInviteForm from "common/data/forms/request-invite";
import {IntlMixin, FormattedMessage, FormattedHTMLMessage }    from "react-intl";

var RequestInvite = React.createClass({

  /**
   */

  mixins: [IntlMixin],

  /**
   */

  onSuccess: function(result) {
    this.props.app.router.redirect("requestInviteComplete", {
      query: {
        shortcode: String(result.shortcode) 
      }
    });
  },

  /**
   */

  render: function() {

    var data = {
      inviterShortcode: this.props.location.query.shortcode
    };

    return <div className="request-invite-form">
      <h4><FormattedMessage message={this.getIntlMessage("authRequstInvite.title")} /></h4>
      <span className="muted"><FormattedHTMLMessage message={this.getIntlMessage("authRequstInvite.info")} /></span>
      <DataForm onSuccess={this.onSuccess} data={data} formClass={RequestInviteForm} {...this.props} submitLabel="authRequstInvite.submitLabel" />
    </div>;
  }
});

export default RequestInvite;