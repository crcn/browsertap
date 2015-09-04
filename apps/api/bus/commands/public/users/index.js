var mesh         = require("mesh");
var sift         = require("sift");
var createRouter = require("api/bus/utils/create-router");
var exists       = require("api/bus/utils/exists");
var mapOperation = require("api/bus/utils/map-operation");
var extend       = require("lodash/object/extend");
// var userSchema   = require("common/schemas/user");
var passwordHash = require("password-hash");
var httperr      = require("httperr");
var runOp        = require("common/utils/bus/create-promise");
var gen          = require("common/utils/bus/wrap-generator");


/*

var account = new Account();
account.save(); // insert

account.addKey({
  secret: password
});

account.addKey({
  oauthToken: "token"
});


*/
module.exports = function(internalBus) {

  return createRouter([

    /**
     */

    sift({ name: "insert" }),
    gen(function*(operation) {
      
    })
  ]);

  return createRouter([

    /**
     * register
     */

    sift({ name: "insert", data: userSchema.validate.bind(userSchema) }),
    gen(function*(operation) {

      // TODO - insert account instead
      // check to see if the user exists
      var exists = !!(yield runOp(internalBus, {
        collection: operation.collection,
        name: "load",
        query: userSchema.pluck({ property: /emailAddress/ }, operation.data)
      }));

      // return an error if the user exists
      if (exists) throw new httperr.Conflict("user exists");

      // serialize data
      var data      = userSchema.serialize(operation.data);

      // hash the password
      data.password = passwordHash.generate(data.password);

      // actually insert the ser
      return yield runOp(internalBus, extend({}, operation, { data: data }));
    }),

    /**
     * login
     */

    sift({ name: "load", query: userSchema.validate.bind(userSchema, { property: /emailAddress|password/ })}),
    gen(function*(operation) {

      var userData = yield runOp(internalBus, extend({}, operation, {
        query: { emailAddress: operation.query.emailAddress }
      }));

      if (!passwordHash.verify(operation.query.password, userData.password)) {
        throw new httperr.Unauthorized("password is incorrect");
      }

      return userSchema.pluck({
        private: { $ne: true }
      }, userData);
    }),

    /**
     * reset password
     */

    sift({ name: "resetPassword", query: userSchema.validate.bind(userSchema, { property: /emailAddress/ }) }),
    mesh.sequence(

      // TODO
      // join("user", function(operation) { })
      mesh.stream(function(operation, stream) {

        // 1 check for email address
        // 2 add reset password token
        // 3 send reset password link
        // internalBus({ collection: operation.collection, query: { emailAddress: operation.query.emailAddress }}).

        stream.end();
      })
    )
  ]);
};

