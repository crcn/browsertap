import co from "co";
import mesh from "mesh";

module.exports = function(generator) {
  return mesh.stream(function(operation, stream) {
    co(function*() {
      return yield generator(operation);
    }).catch(stream.emit.bind(stream, "error")).then(function(result) {
      if (Object.prototype.toString.call(result) !== "[object Array]") {
        result = result != void 0 ? [result] : [];
      }

      if (operation.multi !== true && result.length) {
        result = [result[0]];
      }

      result.forEach(function(data) {
        stream.emit("data", data);
      });
      stream.emit("end");
    });
  });
}