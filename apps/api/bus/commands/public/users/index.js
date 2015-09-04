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
      // var user = new User(operation.data);
      // user.register();

      // user.addKey({
      //   password: 
      // });

      // yield user.insert();
    }),

    /**
     */

    sift({ name: "load" }),
    gen(function*(operation) {
      // var user = User.find({ emailAddress})
      // user.load("emailAddress");

      // user.addKey({
      //   password: 
      // });

      // yield user.insert();
    }),
  ]);
};

