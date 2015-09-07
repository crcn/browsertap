var gen    = require("./generator");
var expect = require("expect.js");

describe(__filename + "#", function() {
  it("can wrap a generator and stream the yielded data", function(next) {

    var bus = gen(function*(operation) {
      return yield new Promise(function(resolve, reject) {
        setTimeout(resolve, 1, operation.a);
      }); 
    });

    var data = [];
    bus({ a: 1, b: 2 }).on("data", data.push.bind(data)).on("end", function() {
      expect(data.length).to.be(1);
      next();
    });
  });

  it("returns only one item in a returned array if multi = false", function(next) {
    var bus = gen(function*(operation) {
      return yield new Promise(function(resolve, reject) {
        setTimeout(resolve, 1, operation.a);
      }); 
    });

    var data = [];
    bus({ a: [1, 2, 3] }).on("data", data.push.bind(data)).on("end", function() {
      expect(data.length).to.be(1);
      next();
    });
  });

  it("returns multiple items in an array if multi=true", function(next) {
    var bus = gen(function*(operation) {
      return yield new Promise(function(resolve, reject) {
        setTimeout(resolve, 1, operation.a);
      }); 
    });

    var data = [];
    bus({ multi: true, a: [1, 2, 3] }).on("data", data.push.bind(data)).on("end", function() {
      expect(data.length).to.be(3);
      next();
    });
  });
});