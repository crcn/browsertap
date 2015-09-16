import createRouter   from "api/bus/drivers/create-router";
import sift           from "sift";
import mesh           from "common/mesh";
import httperr        from "httperr";
import mu             from "mustache";
import fs             from "fs";
import templates      from "./templates";
import _command       from "api/bus/drivers/command";
import cstripe        from "stripe";
import StripeCustomer from "api/data/models/stripe-customer";
import Organization   from "common/data/models/organization";

export default function(app, bus) {

  return {

    /**
     */

    addStripeCustomer: _command({
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
