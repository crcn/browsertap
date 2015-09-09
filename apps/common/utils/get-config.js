import LogLevels from "common/logger/levels";

/**
 */

module.exports = function(env) {
  return {
    loggly: {

      // https://browsertap.loggly.com/login
      token: "8b127293-b6a6-40a8-b010-fbbcf9ea3437",
      subdomain: "browsertap"
    },
    log : {
      level: LogLevels.fromString(env.LOG_LEVEL || env.NODE_ENV || "ALL")
    },
    socket: {
      channel: "operations"
    }
  };
};
