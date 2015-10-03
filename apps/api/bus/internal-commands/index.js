import createRouter from "api/bus/drivers/create-router";
import sift         from "sift";
import EmailForm    from "api/data/forms/email";
import httperr      from "httperr";
import commands     from "common/mesh/commands";

export default function(app, bus) {
  return commands(Object.assign(
    require("./email")(app, bus),
    require("./payments")(app, bus)
  ), bus);
};
