module.exports = Object.assign({
  parallel   : require("./parallel"),
  noop       : require("./noop"),
  accept     : require("./accept"),
  reject     : require("./reject"),
  attach     : require("./attach"),

  // TODO - separate into a promise, resolve, or reject
  yields     : require("./yields"),
  fallback   : require("./fallback"),
  catchError : require("./catch-error"),
  spy        : require("./spy")
}, require("./_responses"));
