import { AsyncResponse } from "./_responses";

export default function(err, result) {

  if (!Array.isArray(result)) {
    result = result != void 0 ? [result] : [];
  }

  return function(operation) {
    if (err) throw err;
    var resp = new AsyncResponse();
    result.forEach(resp.write.bind(resp));
    resp.end();
    return resp;
  }
};
