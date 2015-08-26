var mesh         = require("mesh");
var sift         = require("sift");
var createRouter = require("api/bus/utils/create-router");
var exists       = require("api/bus/utils/exists");

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
          query: {
            emailAddress: operation.data.emailAddress,
            password: operation.data.password
          }
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
    ),

    // reset password
    sift({ name: "resetPassword" }),
    mesh.sequence(

      // TODO
      // join("user", function(operation) { })
      mesh.stream(function(operation, stream) {

        // internalBus({ collection: operation.collection, query: { emailAddress: operation.query.emailAddress }}).

      })
    )
  ]);
};

