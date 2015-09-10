import React      from "react";
import DataForm   from "common/components/data-form";
import SignupForm from "common/data/forms/signup"; 

var Signup = React.createClass({
  render: function() {
    return <DataForm formClass={SignupForm} {...this.props} submitLabel="authSignup.submitLabel"  />;
  }
}); 
 
export default Signup;