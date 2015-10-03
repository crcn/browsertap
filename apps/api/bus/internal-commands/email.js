import createRouter from "api/bus/drivers/create-router";
import sift         from "sift";
import EmailForm    from "api/data/forms/email";
import httperr      from "httperr";
import _command     from "common/bus/drivers/command";

export default function(app, bus) {
  return {

    /**
     */

    sendEmail: _command({
      execute: function*(operation) {
        var form = new EmailForm(Object.assign({ bus: bus }, operation.data));
        yield app.emailer.send(form);
      }
    })
  };
};
