module.exports = Object.assign({
  parallel   : require("./parallel"),
  noop       : require("./noop"),
  accept     : require("./accept"),
  reject     : require("./reject"),
  attach     : require("./attach"),
  catchError : require("./catch-error")
}, require("./_responses"));