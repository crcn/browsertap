import sift           from "sift";
import httperr        from "httperr";
import mu             from "mustache";
import fs             from "fs";
import CommandBus     from "common/mesh/bus/command";
import cstripe        from "stripe";
import StripeCustomer from "api/data/models/stripe-customer";
import Organization   from "common/data/models/organization";

export default function(app, bus) {

  return {

    /**
     */

    chargeUsersForUsage: new CommandBus({
      execute: function*(operation) {
        for (var customer of StripeCustomer.all(app.bus)) {
          var organization = Organization.findOne(app.bus, { _id: customer.organization._id });
          var plan         = yield organization.getPlan();
          var usage        = yield organization.getUsage();

          // TODO - charge based on plan
          var amount = plan.calculateChargeAmount(usage);
          if (amount === 0) continue;

          var invoice = yield customer.charge(amount);

          yield usage.reset();
          // TODO - send email here
        }
      }
    })
  };
};
