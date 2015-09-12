import httperr from "httperr";

/**
 */

export default function(options) {

  var {auth, execute} = options;

  return function*(operation) {

    if (auth === true && !operation.session.userId) {
      throw new httperr.Unauthorized("must be logged in for this");
    }

    return yield execute(operation);
  };
};
