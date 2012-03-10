(function() {
  var Loader;

  module.exports = Loader = (function() {
    /*
    */
    function Loader(config) {
      this.config = config;
      this._loaders = [];
    }

    /*
    */

    Loader.prototype.load = function(target, next) {
      var loader, _i, _len, _ref;
      _ref = this._loaders;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        loader = _ref[_i];
        if (loader.test(target)) return loader.run(target, next, this.config);
      }
      throw new Error("Cannot load " + target);
    };

    /*
    */

    Loader.prototype.add = function(loader) {
      return this._loaders.push(loader);
    };

    return Loader;

  })();

}).call(this);
