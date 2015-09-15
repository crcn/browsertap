import sift              from "sift";
import mesh              from "common/mesh";
import httperr           from "httperr";
import _command          from "api/bus/drivers/command";
import Invitee           from "api/data/models/invitee";
import User              from "api/data/models/user";
import RequestInviteForm from "common/data/forms/request-invite";

export default function(app, bus) {

  var browserHost = app.get("config.hosts.browser");

  return {

    /**
     */

    requestInvite: _command({
      execute: function*(operation) {

        var form = new RequestInviteForm(Object.assign({ bus: bus }, operation.data));

        if (yield User.findOne(bus, { emailAddress: form.emailAddress.valueOf() })) {
          throw new httperr.Conflict("userEmailAddressExists");
        }

        var invitee;

        // return invitee based on email address. Don't want to lock them out
        // from seeing the secondary page which allows them to invite people.
        if (!(invitee = yield Invitee.findOne(bus, { emailAddress: form.emailAddress.valueOf() }))) {
          var invitee = new Invitee(form);
          yield invitee.insert();
        }

        return invitee;
      }
    })
  };
};
