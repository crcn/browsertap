var Application = require('../../application');

module.exports = {
  timeout: function(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
  createFakeApp: async function() {
    var app = new Application({
      testMode: true
    });
    app.initialize();
    return app;
  }
}
