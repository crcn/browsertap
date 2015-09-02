var createGenerator = require("./create-promise");
var expect          = require("expect.js");
var mesh            = require("mesh");
var co              = require("co");

describe(__filename + "#", function() {
  it("yields one value if multi is false", function(done) {
    var bus  = mesh.yields(void 0, [1, 2, 3, 4]);
    var cbus = createGenerator.bind(this, bus);

    co(function*() {
      var result = yield cbus({ multi: false });
      expect(result).to.be(1);
    }).then(done, done);
  });

  it("can yield no values", function(done) {
    var bus  = mesh.yields(void 0, []);
    var cbus = createGenerator.bind(this, bus);

    co(function*() {
      var result = yield cbus({ multi: false });
      expect(result).to.be(void 0);
    }).then(done, done);
  });

  it("can yield multiple values", function(done) {
    var bus  = mesh.yields(void 0, [0, 1, 2]);
    var cbus = createGenerator.bind(this, bus);

    co(function*() {
      var result = yield cbus({ multi: true });
      expect(result.length).to.be(3);
      expect(result[0]).to.be(0);
    }).then(done, done);
  });

  it("can catch an error", function(done) {
    var bus  = mesh.yields(new Error("fail"));
    var cbus = createGenerator.bind(this, bus);

    co(function*() {
      var err;
      try {
        var result = yield cbus({ multi: true });
      } catch (e) {
        err = e;
      }
      expect(err.message).to.be("fail");
    }).then(done, done);
  });

  it("can read a lot of stuff", function(done) {

    function* run2() {
      yield 2;
    }


    function* run() {
      var result = yield run2();
      yield result;
    }

    co(function*() {
      console.log(...run(), "OK");
    });

    setTimeout(done, 100);
  });
});
