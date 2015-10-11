import sift         from "sift";
import EmailForm    from "api/data/forms/email";
import httperr      from "httperr";
import CommandBus   from "common/mesh/bus/command";

export default function(app, bus) {
  return {

    /**
     */

    sendEmail: new CommandBus({
      execute: function*(operation) {
        var form = new EmailForm(Object.assign({ bus: bus }, operation.data));
        yield app.emailer.send(form);
      }
    })
  };
};
