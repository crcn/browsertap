var APIApplication = require("../application");

var port = 8091;

beforeEach(function(next) {

  global.apiApp = new APIApplication({
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

  global.apiApp.initialize().then(next);
});

afterEach(function(next) {

  // global.apiApp.dispose().then(next);
  next();
});
