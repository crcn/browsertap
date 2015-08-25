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

  plugins: BaseApplication.prototype.plugins.concat([

    // public en
    // require("./public-commands"),

    // initialize the models

    // http server
    require("./plugins/http"),

    // socket.io
    require("./plugins/socket"),

    // db - mock, mongodb, etc
    require("./plugins/db")
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
