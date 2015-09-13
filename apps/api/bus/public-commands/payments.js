import createRouter       from "api/bus/drivers/create-router";
import sift               from "sift";
import mesh               from "common/mesh";
import httperr            from "httperr";
import mu                 from "mustache";
import fs                 from "fs";
import templates          from "./templates"
import _command           from "./_command";
import cstripe            from "stripe"
import StripeCustomer     from "api/data/models/stripe-customer"

export default function(app, bus) {

  var browserHost = app.get("config.hosts.browser");
  var stripe      = cstripe(app.get("config.stripe.sk"));

  return {

    /**
     */

    addStripeCustomer: _command({
      auth: true,
      execute: function*(operation) {

        var data = yield stripe.customers.create({
          source: operation.data.id,
          email: operation.user.emailAddress.valueOf()
        });

        // TODO - find existing customer
        var customer = new StripeCustomer(Object.assign({ bus: app.bus }, data, {
          organization: operation.data.organization
        }))

        customer.insert();
      }
    })
  };
};
