// Generated by CoffeeScript 1.6.3
var ExtensionsView, mojo, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

mojo = require("mojojs");

ExtensionsView = (function(_super) {
  __extends(ExtensionsView, _super);

  function ExtensionsView() {
    _ref = ExtensionsView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ExtensionsView.prototype.paper = require("./index.pc");

  return ExtensionsView;

})(mojo.View);

module.exports = ExtensionsView;