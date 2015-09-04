var BaseApplication = require("common/application");
var extend          = require("lodash/object/extend");
var cluster         = require("cluster");
var http            = require("./http");
var createBus       = require("./bus");


class APIApplication extends BaseApplication {

  /**
   */

  initialize(next) {

    // fork it?
    if (cluster.isMaster && this.get("config.numCores") > 0) {
      this.logger.info("fourk it %d times ✊", this.config.numCores);
      for (var i = this.config.numCores; i--;) this.fork();
      if (next) next();
      return;
    }

    return super.initialize(next);
  }

  /**
   */

  initializePlugins() {
    super.initializePlugins();
    this.use(http);
    this.bus = createBus(this, this.bus);
  }

  /**
   */

  fork() {
    cluster.fork().once("exit", this.fork.bind(this));
  }
}

/**
 */

module.exports = APIApplication;
