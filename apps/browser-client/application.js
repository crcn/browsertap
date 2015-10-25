var ReactDOM         = require('react-dom');
var React            = require('react');
var BaseApplication  = require('common/application');
var Router           = require('common/router');
var Main             = require('./components/main');
var routes           = require('./routes');
var BrowserClientBus = require('./bus');
var shortcuts        = require('./shortcuts');

/**
 */

class BrowserClientApplication extends BaseApplication {

  /**
   */

  intl = {
    messages: Object.assign({},
      require('./translations/en'),
      require('common/translations/en')
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
    this.use(shortcuts);
    this.bus = BrowserClientBus.create(this, this.bus);
  }

  /**
   */

  initialize() {
    super.initialize(this);
    this.router.initialize();

    var props = Object.assign({
      app      : this,
      location : this.router.location
    }, this.intl);

    if (this.element) ReactDOM.render(React.createElement(Main, props), this.element);

    return Promise.resolve();
  }
}

/**
 */

module.exports = BrowserClientApplication;
