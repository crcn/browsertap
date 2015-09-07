var co = require("co");

module.exports = function*(bus, operation) {
  var request = bus(operation);

  var result = yield new Promise(function(resolve, reject) {
    var data = [];
    request.on("data", data.push.bind(data)).on("error", reject).on("end", resolve.bind(this, data));
  });

  return operation.multi ? result : result.length ? result[0] : void 0;
};
