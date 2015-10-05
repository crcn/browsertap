import BrowserApplication from "../application";
import mesh from "common/mesh";

var port = 8091;

beforeEach(function(next) {

  var session = {};

  global.browserApp = new BrowserApplication({
    test: {},
    element: document.createElement("div"),
    bus: mesh.attach({ public: true, session: session }, apiApp.bus),
    debug: true,
    config: {
      beta: false,
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
      },
      hosts: {
        browser: "0.0.0.0:8080"
      }
    }
  });

  global.browserApp.initialize().then(next);
});

afterEach(function(next) {

  // global.apiApp.dispose().then(next);
  next();
});
