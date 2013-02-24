var structr  = require("structr"),
Timer        = require("./timer"),
EventEmitter = require("events").EventEmitter,
_            = require("underscore");

module.exports = structr(EventEmitter, {

  /**
   */

  "__construct": function(name) {
    this.name = name;
    this.createdAt = new Date();
  },

  /**
   */

  "data": function(data) {
    if(!arguments.length) return this._data;
    this._data = data;
    return this;
  },

  /**
   */

  "stop": function() {
    this.track();
  },

  /**
   */

  "track": function(data) {
    var d = _.extend(this._data || {},
    data || {},
    {
      name: this.name,
      createdAt: this._createdAt,
      trackedAt: new Date(),
      duration: Date.now() - this._createdAt.getTime()
    });

    this.emit("track", d);
  }
});