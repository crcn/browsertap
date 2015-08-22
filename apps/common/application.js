var BaseModel       = require("./models/base/model");
var extend          = require("lodash/object/extend");
var mesh            = require("mesh");
var registerPlugins = require("./core/register-plugins");
var flatten         = require("lodash/array/flattenDeep");

/**
 */

function Application(properties) {
  BaseModel.call(this, properties);
  this.use.apply(this, this.plugins);
}

/**
 */

extend(Application.prototype, BaseModel.prototype, {

  /**
   */

  bus: mesh.noop,

  /**
   */

  plugins: [
    require("./commands"),
    require("./logger"),
    require("./extra")
  ],

  /**
   */

  use: function() {
    registerPlugins(this, flatten(Array.prototype.slice.call(arguments)));
  },

  /**
   */

  initialize: function(next) {
    return this.bus({ name: "initialize" }).once("end", next || function() { });
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
