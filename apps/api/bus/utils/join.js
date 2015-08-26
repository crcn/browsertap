var mesh  = require("mesh");
var async = require("async");

//join()
module.exports = function(createJoin) {
  return mesh.next(function(operation, next) {
    var joins = createJoin(operation);
    async.each(Object.keys(joins), function(key, next) {
      // var data = [];
      // var request = joins[key];
      // request
      // .on("data", data.push.bind(data)
      // .on("error", next)
      // .on("end", function() {
      //   if (!data.length) return;
      //   if (operation.multi) {
      //     operation[key] = data;
      //   } else {
      //     operation
      //   }
      // })
      // .on("end", next);
    }, next);
  });
};
