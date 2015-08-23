var mesh         = require("mesh");
var sift         = require("sift");
var createRouter = require("../utils/create-router");

module.exports = function(internalBus) {
  return createRouter([

    // register
    sift({ name: "insert" }),
    mesh.sequence(
      // validate

      // user exists?
      exists(function(operation) {
        return internalBus({
          collection: operation.collection,
          name: "load",
          query: { emailAddress: operation.data.emailAddress, password: operation.data.password }
        });
      }, mesh.yields(new Error("user exists"))),

      // No - insert it
      internalBus
    ),

    // login
    sift({ name: "load", query: { emailAddress: /^.+$/, password: /^.+$/ }}),
    mesh.sequence(

      // validate query
      internalBus
    )
  ]);
};

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
