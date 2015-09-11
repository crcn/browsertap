import BrowserApplication from "../application";
import mesh from "common/mesh"

var port = 8091;

beforeEach(function(next) {

  global.browserApp = new BrowserApplication({
    element: document.createElement("div"),
    bus: mesh.attach({ public: true }, apiApp.bus),
    debug: true,
    config: {
      log: {
        level: 0
      },
      db: {
        type: "mock"
      },
      email: {
        type: "mock"
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

  global.browserApp.initialize().then(next);
});

afterEach(function(next) {

  // global.apiApp.dispose().then(next);
  next();
});