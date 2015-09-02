var gen = require("./wrap-generator");

describe(__filename + "#", function() {
  it("can wrap a generator an stream the yielded data", function(next) {

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
});