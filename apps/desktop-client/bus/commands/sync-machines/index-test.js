var testUtils = require("desktop-client/test/utils");
var MockSlave = require("desktop-client/test/mocks/slave");
var findOpenPort = require("find-open-port");
import { AcceptBus, BufferedBus, EmptyResponse } from "mesh";
import readAll from "common/mesh/utils/read-all";
import expect from "expect.js";
import sift from "sift";

describe(__filename + "#", function() {

  return;

  var app;

  beforeEach(function(next) {
    testUtils.createFakeApp().then(function(a) {
      app = a;
      next();
    }, next);
  });

  xit("automatically synchronizes windows from a machine that was added", async function() {

    var slave = new MockSlave({
      bus: AcceptBus.create(sift({
        name: "load",
        collection: "virtWindows"
      }), BufferedBus.create(void 0, [{width:100,height:100,title:"abba"}, {width:100,height:100,title:"baab"}]))
    });

    await slave.listen(await findOpenPort());
    await app.bus.execute({ name: "insert", collection: "servers", data: {
      host: "127.0.0.1",
      port: slave.port
    }}).read();

    await testUtils.timeout(100);

    var virtWindows = await readAll(app.bus.execute({
      name: "load",
      collection: "virtWindows",
      multi: true
    }));

    expect(virtWindows.length).to.be(2);

    slave.dispose();
  });
});
