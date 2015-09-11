import React      from "react";
import DataForm   from "common/components/data-form";
import SignupForm from "common/data/forms/signup"; 
import {IntlMixin, FormattedMessage, FormattedHTMLMessage }    from "react-intl";
 
var Signup = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    return <div className="signup-form">
      <DataForm formClass={SignupForm} {...this.props} submitLabel="authSignup.submitLabel"  />
      <div className="footer">
        <span className="cta">
          <FormattedHTMLMessage message={this.getIntlMessage("authSignup.logInCta")} logInLink={this.props.app.router.getUrl("login")} />
        </span>
      </div>
    </div>;
  }
}); 
 
export default Signup;