var connect = require('connect'),
http = require('http'),
send = connect.static.send;

var res = module.exports = {
  __proto__: http.ServerResponse.prototype
};


//taken from express
res.sendfile = function(path, options, fn) {
	
	var self = this
    , req = self.req
    , next = this.req.next
    , options = options || {};

  // support function as second arg
  if ('function' == typeof options) {
    fn = options;
    options = {};
  }

  // callback
  options.callback = function(err){
    if (err) {
      // cast ENOENT
      if ('ENOENT' == err.code) err = 404;

      // coerce numeric error to an Error
      // TODO: remove
      // TODO: remove docs for headerSent?
      if ('number' == typeof err) err = utils.error(err);

      // ditch content-disposition to prevent funky responses
      if (!self.headerSent) self.removeHeader('Content-Disposition');

      // woot! callback available
      if (fn) return fn(err);

      // lost in limbo if there's no callback
      if (self.headerSent) return;

      return req.next(err);
    }

    fn && fn();
  };

  // transfer
  options.path = encodeURIComponent(path);
  send(this.req, this, next, options);
}