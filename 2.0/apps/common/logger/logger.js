var BaseModel = require("../models/base/model");
var extend    = require("lodash/object/extend");
var LogLevels = require("./levels");
var mesh      = require("mesh");

/**
 */

function Logger(properties) {
  BaseModel.call(this, properties);
}

/**
 */

extend(Logger.prototype, BaseModel.prototype, {

  /**
   */

  bus: mesh.noop,

  /**
   */

  level: LogLevels.ALL
});

/**
 * attach the methods
 */

Object.keys(LogLevels).forEach(function(key) {
  var code = LogLevels[key];
  if (!(code & LogLevels.NONE)) {
    var type = key.toLowerCase();
    Logger.prototype[type] = function() {
      if (!(this.level & code)) return;
      this.bus({

        // blast off into the either. Enable any handler for logs.
        name: "log",

        // add english term to log
        type: type,

        // maintain consistent property
        level: code,

        // don't do anything to the arguments
        args: Array.prototype.slice.call(arguments, 0)
      });
    };
  }
});

/**
 */

module.exports = Logger;
