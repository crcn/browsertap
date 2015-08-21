var React           = require("react");
var BaseApplication = require("common/application");
var extend          = require("lodash/object/extend");
var Router          = require("common/router");
var Main            = require("./components/main");

/**
 */

function BrowserClientApplication(properties) {
  BaseApplication.call(this, properties);
  this.router = new Router();
}

/**
 */

extend(BrowserClientApplication.prototype, BaseApplication.prototype, {

  /**
   */

  plugins: [
    require("./routes")
  ],

  /**
   */

  initialize: function() {
    BaseApplication.prototype.initialize.call(this);

    var props = extend({
      app      : this,
      location : this.router.location
    });

    React.render(React.createElement(Main, props), this.element);
  }
});

/**
 */

module.exports = BrowserClientApplication;
