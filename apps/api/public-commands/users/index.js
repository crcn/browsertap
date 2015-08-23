var mesh         = require("mesh");
var sift         = require("sift");
var createRouter = require("../utils/create-router");
var exists       = require("../utils/exists");

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
    )
  ]);
};

