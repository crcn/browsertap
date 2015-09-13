import APIApplication from "../application";
import mesh           from "common/mesh";

var port = 8091;

beforeEach(function(next) {

  global.apiApp = new APIApplication({
    debug: true,
    config: {
      beta: false,
      log: {
        level: 0
      },
      db: {
        type: "mock"
      },
      emailer: {
        service: "mock"
      },
      socket: {
        channel: "test-ops",
        host: "http://127.0.0.1:" + port,
      },
      http: {
        port: port++
      }
    }
  });


  global.apiApp.initialize().then(next);
});

beforeEach(function() {
  global.apiApp.session = {};
  global.apiApp.bus = mesh.attach({ app: global.apiApp, session: global.apiApp.session }, global.apiApp.bus);
});

afterEach(function(next) {

  // global.apiApp.dispose().then(next);
  next();
});
