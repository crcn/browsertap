var co = require("co");

module.exports = function(bus) {


  return function*(operation) {
    var request = bus(operation);

    return yield new Promise(function(resolve, reject) {
      var data = [];
      request.on("data", data.push.bind(data)).on("error", reject).on("end", resolve.bind(this, data));
    });
  };
};
