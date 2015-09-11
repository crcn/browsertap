import createRouter       from "api/bus/drivers/create-router";
import sift               from "sift";
import EmailForm          from "api/data/forms/email";
import httperr            from "httperr";

export default function(app, bus) {
  return createRouter([

    /**
     */

    sift({ name: "sendEmail" }),
    function*(operation) {
      var form = new EmailForm(Object.assign({ bus: bus }, operation.data));
      yield app.emailer.send(form);
    }
  ], bus);
};

