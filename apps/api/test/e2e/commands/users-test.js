
var expect = require("expect.js");
var mesh   = require("mesh");
var sift   = require("sift");
var co     = require("co");
var runOp  = require("common/utils/bus/create-promise");

describe(__filename + "#", function() {

  var bus;
  var fixtures = {
    user1: {
      emailAddress: "a@b.com",
      password: "password"
    }
  };

  beforeEach(function() {
    bus = mesh.attach({ public: true, collection: "users" }, global.apiApp.bus);
  });

  describe("insert# ", function() {

    xit("can register a new user", co.wrap(function*() {
      yield runOp(bus, { name: "insert", data:  fixtures.user1 });
      var data = yield runOp(bus, { name: "load", query: fixtures.user1 });
      expect(data.emailAddress).to.be("a@b.com");
    }));

  });
});
