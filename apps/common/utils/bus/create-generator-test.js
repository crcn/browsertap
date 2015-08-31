var createGenerator = require("./create-generator");
var expect          = require("expect.js");
var mesh            = require("mesh");
var co              = require("co");

describe(__filename + "#", function() {
  it("can yield a result returned from a generator", function(done) {
    var bus  = mesh.yields(void 0, [1, 2, 3, 4]);
    var cbus = createGenerator(bus);



    co(function*() {
      var result = yield cbus();
      console.log(result)
    });


    setTimeout(done, 200);

    // co().then(function(result) {
    //   console.log(result);
    //   done();
    // }, done);
  });
});
