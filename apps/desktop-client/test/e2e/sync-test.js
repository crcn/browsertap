var testUtils = require("desktop-client/test/utils");
var MockSlave = require("desktop-client/test/mocks/slave");
var findOpenPort = require("find-open-port");
import { AcceptBus, BufferedBus, EmptyResponse } from "mesh";
import readAll from "common/mesh/read-all";
import expect from "expect.js";
import sift from "sift";

describe(__filename + "#", function() {

  var app;

  beforeEach(function(next) {
    testUtils.createFakeApp().then(function(a) {
      app = a;
      next();
    }, next);
  });

  it("automatically synchronizes windows from a machine that was added", async function() {

    var slave = new MockSlave({
      bus: new AcceptBus(sift({
        name: "load",
        collection: "virtWindows"
      }), new BufferedBus(void 0, [{width:100,height:100,title:"abba"}, {width:100,height:100,title:"baab"}]))
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

  it("opens a new window for each inserted virtual window", async function() {
    var openWindowOps = [];
    app.bus = new AcceptBus(sift({ name: "openWindow" }), {
        execute: function(operation) {
          openWindowOps.push(operation);
          return new EmptyResponse();
        }
      },
      app.bus
    );
    await app.bus.execute({ name: "insert", collection: "virtWindows", data: { width: 100, height: 100 }}).read();
    await testUtils.timeout(200);
    expect(openWindowOps.length).to.be(1);
  });
});
