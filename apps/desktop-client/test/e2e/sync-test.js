var testUtils = require("desktop-client/test/utils");
var MockSlave = require("desktop-client/test/mocks/slave");
var findOpenPort = require("find-open-port");
import { AcceptBus, BufferedBus } from "mesh";
import sift from "sift";

describe(__filename + "#", function() {

  var app;

  beforeEach(function(next) {
    testUtils.createFakeApp().then(function(a) {
      app = a;
      next();
    }, next);
  });

  it("automatically synchronizes windows from a machine that was added", async function(next) {

    var slave = new MockSlave({
      bus: new AcceptBus(sift({
        name: "load",
        collection: "virtWindows"
      }), new BufferedBus(void 0, [{width:100,height:100}]))
    });
    await slave.listen(await findOpenPort());
    console.log(slave.port);
    await app.bus.execute({ name: "insert", collection: "servers", data: {
      host: "127.0.0.1",
      port: slave.port
    }}).read();
    setTimeout(next, 1000);
  });
});
