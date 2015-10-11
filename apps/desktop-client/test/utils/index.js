var Application = require("../../application");

module.exports = {
  createFakeApp: async function() {
    var app = new Application({
      testMode: true
    });
    // await app.initialize();
    return app;
  }
}
