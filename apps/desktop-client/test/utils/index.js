var Application = require("../../application");

module.exports = {
  createFakeApp: async function() {
    var app = new Application({
      testMode: true
    });
    app.initialize();
    return app;
  }
}
