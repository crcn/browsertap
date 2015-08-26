var BaseModel       = require("common/models/base/model");
var extend          = require("lodash/object/extend");
var mesh            = require("mesh");
var flatten         = require("lodash/array/flattenDeep");
var Logger          = require("common/logger");
var createBus       = require("common/bus");
var catchError      = require("./plugins/catch-errors");
var createCommonBus = require("common/bus");

/**
 */

function Application(properties) {
  BaseModel.call(this, properties);

  this.bus = createCommonBus(this);

  this.logger = new Logger(extend({
    bus: function(operation) { 
      return this.bus(operation); 
    }.bind(this)
  }, this.get("config.log")));

}

/**
 */

extend(Application.prototype, BaseModel.prototype, {

  /**
   */

  use: function() {
    flatten(Array.prototype.slice.call(arguments)).forEach(function(plugin) {
      plugin(this);
    }.bind(this));
  },

  /**
   */

  initialize: function(next) {
    this.initializePlugins();
    return this.bus({ name: "initialize" }).once("end", next || function() { });
  },

  /**
   */

  initializePlugins: function() {
    this.use(catchError);
  },

  /**
   */

  dispose: function(next) {
    return this.bus({ name: "dispose" }).once("end", next || function() { });
  }
});

/**
 */

module.exports = Application;
