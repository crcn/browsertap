
exports.NONE     = 1;
exports.NOTICE   = exports.NONE   << 1;
exports.INFO     = exports.NOTICE << 1;
exports.WARN     = exports.INFO   << 1;
exports.ERROR    = exports.WARN   << 1;
exports.VERBOSE  = exports.ERROR  << 1;

exports.ALL         = exports.NONE | exports.INFO | exports.NOTICE | exports.WARN | exports.ERROR | exports.VERBOSE;
exports.PRODUCTION  = exports.NONE | exports.WARN | exports.ERROR;
