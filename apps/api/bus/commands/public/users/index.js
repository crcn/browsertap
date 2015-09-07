var mesh         = require("mesh");
var sift         = require("sift");
var createRouter = require("api/bus/utils/create-router");
var exists       = require("api/bus/utils/exists");
var mapOperation = require("api/bus/utils/map-operation");
var extend       = require("lodash/object/extend");
var passwordHash = require("password-hash");
var httperr      = require("httperr");
var runOp        = require("common/utils/bus/create-promise");
var gen          = require("common/utils/bus/wrap-generator");
var User         = require("api/models/user")

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

      // TODO - oauth token or other shit here
      if (!operation.data.password) {
        throw new httperr.BadRequest("password must be present");
      }

      var user = new User({ bus: internalBus, data: operation.data });
      yield user.insert();

      // user.register();

      // user.addKey({
      //   password: 
      // });

      return user.serialize();
    }),

    /**
     */

    sift({ name: "load", query: { emailAddress: { $exists: true } } }),
    gen(function*(operation) {
      var user = yield User.findOne(internalBus, { emailAddress: operation.query.emailAddress });
      if (!user) throw new httperr.NotFound("user not found");
      if (!operation.query.password) throw new httperr.Unauthorized("Password must be present");
      return user.serialize();
    }),
  ]);
};

