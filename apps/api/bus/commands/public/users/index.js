var mesh         = require("mesh");
var sift         = require("sift");
var createRouter = require("api/bus/utils/create-router");
var exists       = require("api/bus/utils/exists");
var mapOperation = require("api/bus/utils/map-operation");
var extend       = require("lodash/object/extend");
var userSchema   = require("common/schemas/user");
var passwordHash = require("password-hash");
var httperr      = require("httperr");

module.exports = function(internalBus) {

  return createRouter([

    /**
     * register
     */

    sift({ name: "insert", data: userSchema.validate.bind(userSchema) }),
    // gen(function*() {

    //   var exists = yield ps(internalBus({
    //     collection: operation.collection,
    //     name: "load",
    //     query: userSchema.pluck({ property: /emailAddress/ }, operation.data)
    //   }));

    //   if (exists) throw new httperr.Conflict("user exists");


      
    // }),

    mesh.sequence(

      // user exists?
      exists(function(operation) {
        return internalBus({
          collection: operation.collection,
          name: "load",
          query: userSchema.pluck({ property: /emailAddress/ }, operation.data)
        });
      }, mesh.yields(new httperr.Conflict("user exists"))),

      // No - insert it
      function(operation) {
        var data = userSchema.serialize(operation.data);
        data.password = passwordHash.generate(data.password);
        return internalBus(extend({}, operation, { data: data}));
      }
    ),

    /**
     * login
     */

    sift({ name: "load", query: userSchema.validate.bind(userSchema, { property: /emailAddress|password/ })}),
    mesh.wrap(function(operation, next) {

      internalBus(extend({}, operation, {
        query: { emailAddress: operation.query.emailAddress }
      })).once("data", function(userData) {

        if (!passwordHash.verify(operation.query.password, userData.password)) {
          return next(new httperr.Unauthorized("password is incorrect"));
        }

        next(void 0, userSchema.pluck({
          private: { $ne: true }
        }, userData));
      });
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

