var BaseApplication = require("common/application");
var extend          = require("lodash/object/extend");
var cluster         = require("cluster");

/**
 */

function APIApplication(properties) {
  BaseApplication.call(this, properties);
}

/**
 */

extend(APIApplication.prototype, BaseApplication.prototype, {

  /**
   */

  plugins: [require("./bus")].concat(BaseApplication.prototype.plugins).concat([

    // registered commands executable from anywhere in the app
    require("./commands"),

    // http / socket server
    require("./server"),

    // public endpoints
    require("./endpoints"),

    // initialize the models
    require("./models")
  ]),

  /**
   */

  initialize: function(next) {

    if (cluster.isMaster && this.get("config.numCores") > 0) {
      this.logger.info("fourk it %d times ✊", this.config.numCores);
      for (var i = this.config.numCores; i--;) this.fork();
      if (next) next();
    } else {
      BaseApplication.prototype.initialize.call(this, next);
    }

  },

  /**
   */

  fork: function() {
    cluster.fork().once("exit", this.fork.bind(this));
  }
});

/**
 */

module.exports = APIApplication;
