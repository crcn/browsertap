var structr = require("structr"),
Tracker     = require("./tracker");


module.exports = structr({

  /**
   */

  "tracker": function(data) {
    return new Tracker(data);
  }
});