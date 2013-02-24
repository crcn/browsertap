module.exports = require("../base").extend({

  /**
   */

  "init": function() {
    this._instance = this._targetModel();

    //flag so that this instance isn't fetched before it's ready
    this.update({$set:{ "ready": false }});

    this._load();
  },

  /**
   */

  "_load": function() {
    //TODO
  },

  /**
   */

  "onAvailable": function(callback) {
    if(this._available) return callback();
    this.once("available", callback);
  }
});
