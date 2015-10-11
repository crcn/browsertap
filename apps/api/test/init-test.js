import APIApplication from "../application";
import { AttachDefaultsBus } from "mesh";

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

  global.apiApp.initialize().then(function() {
    next();
  });
});

beforeEach(function() {
  global.apiApp.session = {};
  global.apiApp.bus = new AttachDefaultsBus({ app: global.apiApp, session: global.apiApp.session }, global.apiApp.bus);
});

afterEach(function(next) {

  // global.apiApp.dispose().then(next);
  next();
});
