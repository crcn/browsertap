var BaseApplication = require("common/application");
var extend          = require("lodash/object/extend");
var cluster         = require("cluster");
var http            = require("./http");
var socket          = require("./socket");
var createBus       = require("./bus");

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

  initialize: function(next) {

    // fork it?
    if (cluster.isMaster && this.get("config.numCores") > 0) {
      this.logger.info("fourk it %d times ✊", this.config.numCores);
      for (var i = this.config.numCores; i--;) this.fork();
      if (next) next();
      return;
    }

    return BaseApplication.prototype.initialize.call(this, next);
  },

  /**
   */

  initializePlugins: function() {
    BaseApplication.prototype.initializePlugins.call(this);
    this.use(http);
    this.use(socket);
    this.bus = createBus(this, this.bus);
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
