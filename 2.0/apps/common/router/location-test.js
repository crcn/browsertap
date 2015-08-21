var Location = require("./location");
var expect   = require("expect.js");

describe(__filename + "#", function() {

  // don't want.
  xit("disposes the previous state when it changes", function(next) {

    var disposeCount = 0;

    var loc = Location({
      state: {
        prop: {
          dispose: function() {
            disposeCount++;
          }
        }
      }
    });

    loc.set("state", {});

    setTimeout(function() {
      expect(disposeCount).to.be(1);
      next();
    }, 10);
  });
});
