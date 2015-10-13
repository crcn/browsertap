import sift           from "sift";
import httperr        from "httperr";
import mu             from "mustache";
import fs             from "fs";
import templates      from "./templates";
import CommandBus     from "common/mesh/bus/command";
import cstripe        from "stripe";
import StripeCustomer from "api/data/models/stripe-customer";
import Organization   from "common/data/models/organization";

export default function(app, bus) {

  return {

    /**
     */

    addStripeCustomer: new CommandBus({
      auth: true,
      execute: function*(operation) {

        var organization = yield Organization.findOne(bus, {
          _id: operation.data.organization._id
        });

        var data = yield app.stripe.customers.create({
          source: operation.data.customer.id,
          email: operation.user.emailAddress.valueOf()
        });

        // TODO - find existing customer
        var customer = new StripeCustomer(Object.assign({ bus: app.bus }, data, {
          organization: organization
        }));

        return yield customer.insert();
      }
    })
  };
};
