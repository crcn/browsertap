var co   = require("co");
var mesh = require("mesh");

module.exports = function(generator) {
  return mesh.stream(function(operation, stream) {
    co(function*() {
      return yield generator(operation);
    }).catch(stream.emit.bind(stream, "error")).then(function(result) {
      if (Object.prototype.toString.call(result) !== "[object Array]") {
        result = result != void 0 ? [result] : [];
      }
      console.log(result);
      result.forEach(function(data) {
        stream.emit("data", data);
      });
      stream.emit("end");
    });
  });
}