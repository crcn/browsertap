import httperr from "httperr";
import User from "common/data/models/user";
import mesh from "common/mesh";
import co   from "co";

/**
 */

export default function(options) {

  var {auth, execute} = options;

  return function(operation) {

    var resp = new mesh.AsyncResponse();

    co(function*() {
      // TODO - add schema here

      if (auth === true) {

        if (!operation.session.userId) {
          throw new httperr.Unauthorized("must be logged in for this");
        }

        operation.user = yield User.findOne(operation.app.bus, { _id: String(operation.session.userId) });
      }

      return yield execute(operation);
    }).then(resp.end.bind(resp)).catch(resp.error.bind(resp));

    return resp;
  };
};
