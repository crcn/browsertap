var co = require("co");

/**
 */

export default function(bus, onError) {
  return co.wrap(function*(operation) {
    try {
      return yield bus(operation);
    } catch(e) {
      onError(e);
      throw e;
    }
  });
};
