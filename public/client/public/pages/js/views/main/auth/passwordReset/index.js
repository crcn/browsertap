// Generated by CoffeeScript 1.6.3
var PasswordResetView, mojo, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

mojo = require("mojojs");

PasswordResetView = (function(_super) {
  __extends(PasswordResetView, _super);

  function PasswordResetView() {
    _ref = PasswordResetView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  PasswordResetView.prototype.paper = require("./index.pc");

  return PasswordResetView;

})(mojo.View);

module.exports = PasswordResetView;

