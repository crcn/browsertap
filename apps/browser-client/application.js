var React           = require("react");
var BaseApplication = require("common/application");
var Router          = require("common/router");
var Main            = require("./components/main");
var routes          = require("./routes");
var createBus       = require("./bus");
 
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

  initializePlugins() {
    super.initializePlugins();
    this.use(routes);
    this.bus = createBus(this, this.bus);
  }

  /**
   */

  initialize() {
    this.router.initialize(); 

    var props = Object.assign({
      app      : this,
      location : this.router.location
    }, this.intl);

    if (this.element) React.render(React.createElement(Main, props), this.element);

    return super.initialize(this);
  }
}

/**
 */

module.exports = BrowserClientApplication;
