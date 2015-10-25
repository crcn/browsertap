
exports.NONE     = 1;
exports.NOTICE   = exports.NONE   << 1;
exports.INFO     = exports.NOTICE << 1;
exports.WARN     = exports.INFO   << 1;
exports.ERROR    = exports.WARN   << 1;
exports.VERBOSE  = exports.ERROR  << 1;

exports.ALL         = exports.NONE | exports.INFO | exports.NOTICE | exports.WARN | exports.ERROR | exports.VERBOSE;
exports.PRODUCTION  = exports.NONE | exports.WARN | exports.ERROR;
exports.STAGING     = exports.NOTICE | exports.INFO | exports.PRODUCTION;
exports.DEVELOPMENT = exports.ALL;

exports.fromString = function(level) {
  return level.toUpperCase().split('|').map(function(level) {
    return exports[level] || exports.NONE;
  }).reduce(function(a, b) {
    return a | b;
  });
};
