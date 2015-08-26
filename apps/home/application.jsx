var BaseApplication = require("common/application");
var extend          = require("lodash/object/extend");
var React           = require("react");
var Router          = require("common/router");
var Body            = require("./components/body");

var plugins = [
    require("./routes"),
    require("./extra/hijack-anchors")
]

/**
 */

function HomeApplication(properties) {
  this.router = new Router({ sync: !process.browser });
  BaseApplication.call(this, properties);
}  

/**
 */ 

extend(HomeApplication.prototype, BaseApplication.prototype, {

  /**
   */

  initializePlugins: function() {
    this.use(plugins);
  },

  /**
   */

  initialize: function() {
    this.router.initialize();
    BaseApplication.prototype.initialize.call(this);
    this.renderBodyComponent(this.element);
  },

  /**
   */

  renderRootComponent: function(component, props, element) {

    if (arguments.length === 2) {
      element = props;
      props   = {};
    }

    var props = extend(props, {
      app: this,
      location: this.router.location
    });

    React.render(React.createElement(component, props), element);

    return element;
  },

  /**
   */

  renderBodyComponent: function(element) {
    return this.renderRootComponent(Body, {}, element);
  }
});

/**
 */

module.exports = HomeApplication;
