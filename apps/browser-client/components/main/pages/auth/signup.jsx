import React      from "react";
import DataForm   from "common/components/data-form";
import SignupForm from "common/data/forms/signup"; 
import {IntlMixin, FormattedMessage, FormattedHTMLMessage }    from "react-intl";
 
var Signup = React.createClass({
  mixins: [IntlMixin],

  onSuccess: function(result) {
    setTimeout(function() {
      this.props.app.router.redirect("app"); 
    }.bind(this), 1000 * 2);
  },

  render: function() {
    return <div className="signup-form">
      <DataForm title="authSignup.title" formClass={SignupForm} {...this.props} onSuccess={this.onSuccess} successMessage="authSignup.successMessage" submitLabel="authSignup.submitLabel"  />
      <div className="footer">
        <span className="cta">
          <FormattedHTMLMessage message={this.getIntlMessage("authSignup.logInCta")} logInLink={this.props.app.router.getUrl("login")} />
        </span>
      </div>
    </div>;
  }
}); 
 
export default Signup;