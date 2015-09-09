var React           = require("react");
var BaseApplication = require("common/application");
var extend          = require("lodash/object/extend");
var Router          = require("common/router");
var Main            = require("./components/main");

/**
 */

class BrowserClientApplication extends BaseApplication {

  /**
   */
  constructor() {
    super(...arguments);
    this.router = new Router();
  }

  // plugins: [require("./bus")].concat(BaseApplication.prototype.plugins, [
  //   require("./routes")
  // ]),

  /**
   */

  initialize() {
    super.initialize(this);

    var props = extend({
      app      : this,
      location : this.router.location
    });

    React.render(React.createElement(Main, props), this.element);
  }
}

/**
 */

module.exports = BrowserClientApplication;
