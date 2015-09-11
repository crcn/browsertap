var React           = require("react");
var BaseApplication = require("common/application");
var Router          = require("common/router");
var Main            = require("./components/main");
var routes          = require("./routes");
 
/**
 */

class BrowserClientApplication extends BaseApplication {

  /**
   */

  intl = {
    messages: Object.assign({}, 
      require("./translations/en"), 
      require("common/translations/en")
    )
  }

  /**
   */

  constructor() {
    super(...arguments);
    this.router = new Router();
  }

  /**
   */

  initialize() {
    super.initialize(this);
    this.use(routes);
    this.router.initialize(); 

    var props = Object.assign({
      app      : this,
      location : this.router.location
    }, this.intl);

    React.render(React.createElement(Main, props), this.element);
  }
}

/**
 */

module.exports = BrowserClientApplication;
