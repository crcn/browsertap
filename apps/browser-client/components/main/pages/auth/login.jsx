import React     from "react";
import DataForm  from "common/components/data-form";
import LoginForm from "common/data/forms/login";
// import Link      from "common/components/link"

import {IntlMixin, FormattedMessage, FormattedHTMLMessage }    from "react-intl";


var Login = React.createClass({

  mixins: [IntlMixin],
 
  onSuccess: function(result) {
    setTimeout(function() {
      this.props.app.router.redirect("app"); 
    }.bind(this), process.browser ? 1000 * 2 : 0);
  }, 

  render: function() {
    return <div className="login-form">
      <h4><FormattedHTMLMessage message={this.getIntlMessage("authLogin.title")} /></h4> 
      { this.props.location.query.showMessage ? 
        <div className="alert alert-info"><FormattedHTMLMessage message={this.getIntlMessage(this.props.location.query.showMessage)} /></div> : void 0
      }
      <DataForm formClass={LoginForm} {...this.props} onSuccess={this.onSuccess} successMessage="authLogin.successMessage" submitLabel="authLogin.submitLabel" />
      <div className="footer">

        <span className="cta">
          <FormattedHTMLMessage message={this.getIntlMessage("authLogin.forgotCta")} forgotLink={this.props.app.router.getUrl("forgotPassword")} />
        </span>

        <span className="cta">
          <FormattedHTMLMessage message={this.getIntlMessage("authLogin.signUpCta")} signUpLink={this.props.app.router.getUrl("signup")} />
        </span>
      </div>
    </div>;
  }
});
 
export default Login;