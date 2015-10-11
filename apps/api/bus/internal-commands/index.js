import createRouter from "api/bus/drivers/create-router";
import sift         from "sift";
import EmailForm    from "api/data/forms/email";
import httperr      from "httperr";
import CommandsBus  from "common/mesh/bus/commands";

class InternalCommandsBus extends CommandsBus {
  constructor(app, bus) {
    super(Object.assign({},
      require("./email")(app, bus),
      require("./payments")(app, bus)
    ), bus);
  }
}

export default InternalCommandsBus;
