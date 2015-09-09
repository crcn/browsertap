import React     from "react";
import DataForm  from "common/components/data-form";
import LoginForm from "common/data/forms/login";

var Login = React.createClass({
  render: function() {
    return <DataForm formClass={LoginForm} {...this.props} />;
  }
});

export default Login;