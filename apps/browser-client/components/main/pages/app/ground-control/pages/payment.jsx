import React       from "react";
import DataForm    from "common/components/data-form";
import PaymentForm from "browser-client/data/forms/payment"

var Payment = React.createClass({

  render: function() {
    var data = {
      organization: this.props.location.organization
    };
    return <DataForm formClass={PaymentForm} {...this.props} data={data} />
  }
});

export default Payment;