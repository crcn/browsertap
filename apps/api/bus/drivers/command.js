import httperr from "httperr";
import User from "api/data/models/user";

/**
 */

export default function(options) {

  var {auth, execute} = options;

  return function*(operation) {

    // TODO - add schema here

    if (auth === true) {

      if (!operation.session.userId) {
        throw new httperr.Unauthorized("must be logged in for this");
      }

      operation.user = yield User.findOne(operation.app.bus, { _id: String(operation.session.userId) });
    }

    return yield execute(operation);
  };
};
