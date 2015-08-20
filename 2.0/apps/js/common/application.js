var BaseModel = require("./models/base/model");
var extend    = require("xtend/mutable");

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

  plugins: [],

  /**
   */

  use: function() {
    Array.prototype.forEach.call(arguments, function(plugin) {
      plugin(this);
    }.bind(this));
  }
});

/**
 */

module.exports = Application;
