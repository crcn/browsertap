import createRouter   from "api/bus/drivers/create-router";
import sift           from "sift";
import mesh           from "common/mesh";
import httperr        from "httperr";
import mu             from "mustache";
import fs             from "fs";
import _command       from "api/bus/drivers/command";
import cstripe        from "stripe"
import StripeCustomer from "api/data/models/stripe-customer"
import Organization   from "api/data/models/organization"

export default function(app, bus) {
 
  return {

    /**
     */

    chargeStripeCustomer: _command({
      execute: function*(operation) {

      }
    })
  };
};
