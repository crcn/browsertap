import createRouter       from "api/bus/drivers/create-router";
import sift               from "sift";
import mesh               from "common/mesh";
import httperr            from "httperr";
import fs                 from "fs";
import templates          from "./templates"
import _command           from "api/bus/drivers/command";
import cstripe            from "stripe"
import Organization       from "api/data/models/organization"

export default function(app, bus) {

  var browserHost = app.get("config.hosts.browser");
  var stripe      = cstripe(app.get("config.stripe.sk"));

  return {

    /**
     */

    requestInvite: _command({
      auth: true,
      execute: function*(operation) {
        console.log("RINVITE");
      }
    })
  };
};
