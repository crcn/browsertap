var platform = require("platform");

/**
 */

module.exports = process.browser ? browser : server;

/**
 */

function browser(app) {
  window.onerror = function(error, url, lineNumber) {
    app.logger.error(error.message, {
      url        : url,
      lineNumber : lineNumber,
      stack      : error.stack
    });
  };
}

/**
 */

function server(app) {
  process.on("uncaughtException", function(error) {
    app.logger.error(error.message, { stack: error.stack });
    app.logger.notice("gracefully shutting down");

    // give some time for the op to send to loggly
    setTimeout(process.exit.bind(process, 1), 1000 * 4);
  });
}
