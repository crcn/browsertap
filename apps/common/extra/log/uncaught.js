var platform   = require("platform");
var parseStack = require("parse-stack");

/**
 */

module.exports = process.browser ? browser : server;

/**
 */

var platformInfo = {
  name    : platform.name,
  version : platform.version
};

/**
 */

function browser(app) {
  window.onerror = function(error, url, lineNumber) {
    app.logger.error(error.message, {
      url        : url,
      lineNumber : lineNumber,
      stack      : parseStack(error),
      platform   : platformInfo
    });
  };
}

/**
 */

function server(app) {
  process.on("uncaughtException", function(error) {
    app.logger.error(error.message, { stack: parseStack(error), platform: platformInfo });
    app.logger.notice("gracefully shutting down");

    // give some time for the op to send to loggly
    setTimeout(process.exit.bind(process, 1), 1000 * 4);
  });
}

