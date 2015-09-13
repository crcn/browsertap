import React       from "react";
import DataForm    from "common/components/data-form";
import PaymentForm from "browser-client/data/forms/payment"

var Payment = React.createClass({
  
  render: function() {
    return <DataForm formClass={PaymentForm} {...this.props} />
  }
});

export default Payment;