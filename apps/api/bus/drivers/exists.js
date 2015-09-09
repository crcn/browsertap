import mesh from "mesh";

/**
 */

function exists(bus, yesBus, noBus) {

  if (!noBus) noBus   = mesh.noop;
  if (!yesBus) yesBus = mesh.noop;

  return mesh.stream(function(operation, stream) {
    var data = [];
    bus(operation)
    .on("data", data.push.bind(data))
    .on("end", function() {
      (data.length ? yesBus(operation) : noBus(operation)).pipe(stream);
    });
  });
}

/**
 */

module.exports = exists;
