import BaseApplication from "common/application";
import extend from "lodash/object/extend";
import cluster from "cluster";
import http from "./http";
import email from "./email";
import createBus from "./bus";

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
    if (this.debug !== true) {
      this.use(http);
    }
    this.use(email);
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
